import { useState, useEffect } from "react"
import { Container, Form, Nav } from "react-bootstrap"
import { db } from "../firebase"
import { useAuth } from '../contexts/AuthContext'
import { doc, getDoc } from "firebase/firestore";
import Navigation from "../Navigation"
import QuizResult from "./QuizResult";
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"

export default function Results() {
    const { currentUser } = useAuth()
    const [quizzes, setQuizzes] = useState([])
    const [wins, setWins] = useState(0)
    const [total, setTotal] = useState(0)
    const [parsedQuizzes, setParsedQuizzes] = useState([])
    const [filteredQuizzes, setFilteredQuizzes] = useState(parsedQuizzes)
    const [userData, setUserData] = useState({
      labels: ["Correct", "Incorrect", "Total"],
      datasets: [{
        label: "Results",
        data: [wins, total - wins, total]
      }]
    })

    const options = {
      plugins: {  // 'legend' now within object 'plugins {}'
        legend: {
          labels: {
            color: "rgb(254, 233, 212)",  // not 'fontColor:' anymore
          }
        }
      },
      scales: {
        y: {  // not 'yAxes: [{' anymore (not an array anymore)
          ticks: {
            color: "rgb(254, 233, 212)", // not 'fontColor:' anymore
          },
          grid: {
            color: "rgb(254, 233, 212)"
          }
        },
        x: {  // not 'xAxes: [{' anymore (not an array anymore)
          ticks: {
            color: "rgb(254, 233, 212)",  // not 'fontColor:' anymore
          },
          grid: {
            color: "transparent"
          }
        }
      }
    }

     //Get Quizzes from Database
     useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "users", currentUser.uid);
            try {
                const docSnap = await getDoc(docRef);
                setQuizzes(docSnap.data().quizzes);
                setWins(docSnap.data().wins);
                setTotal(docSnap.data().totalQuizzes);
            } catch(error) {
                console.log(error)
            }
        }
        fetchData();
      },[])

      //Parses the fetched quiz objects.
      useEffect(() => {
        let parsedItems = []
        quizzes.forEach(function(quiz) {
            parsedItems.push((JSON.parse(quiz)));
        });
        setParsedQuizzes(parsedItems)
        setUserData({
          labels: ["Correct", "Incorrect", "Total"],
          datasets: [{
            label: "Amount",
            data: [wins, total - wins, total],
            backgroundColor: ["rgb(0, 22, 7)", "rgb(25, 1, 0)", "rgb(21, 16, 11)"],
            borderColor: ["rgb(0, 130, 33)", "rgb(130, 28, 0)","rgb(255, 138, 20)"],
            borderWidth: 2.5, 
          }],
        })
      }, [quizzes]);


  return (
    <>
    <Navigation />
    <Container>
        <header className="d-flex align-items-center justify-content-between results-header">
            <h2 className="fs-2 m-0">My Quizzes:</h2>
            <div style={{width: "300px"}} className="bar-graph">
              <Bar data={userData} options={options}/>
            </div>
            <p className="m-0" style={{color: "var(--orange-color)"}}>My score: <span style={{color: "var(--text-color)", whiteSpace: "nowrap"}}>{wins} / {total}</span></p>
        </header>
        {parsedQuizzes.map((quiz, index) => {
              return (
                  <QuizResult {...quiz} quiz={quiz} key={index}/>
                )
              })}
    </Container>
    </>
  )
}
