import { useState, useEffect, useRef } from "react"
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
    //userData state for Chart.js bar graph
    const [userData, setUserData] = useState({
      labels: ["Correct", "Incorrect", "Total"],
      datasets: [{
        label: "Results",
        data: [wins, total - wins, total]
      }]
    })
    const orderRef= useRef();
    
    //options for chart.js bar graph
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

      //Changes order of quiz results from newest to oldest
      function handleOrderChange() {
        const resultsSection = document.getElementById("results-section")
        if (orderRef.current.value === "recent") {
          resultsSection.classList.remove("flex-column")
          resultsSection.classList.add("flex-column-reverse")
        } else {
          resultsSection.classList.remove("flex-column-reverse")
          resultsSection.classList.add("flex-column")
        }
      }


  return (
    <>
    <Navigation />
    <Container>
        <header className="d-flex justify-content-between results-header">
            <h2 className="fs-2 m-0">My Quizzes:</h2>
            <div style={{width: "300px"}} className="bar-graph">
              <Bar data={userData} options={options}/>
            </div>
            <p className="m-0" style={{color: "var(--orange-color)"}}>My score: <span style={{color: "var(--text-color)", whiteSpace: "nowrap"}}>{wins} / {total}</span></p>
        </header>
        <section className="sort-wrapper d-flex justify-content-end gap-2">
          <Form.Group className="mb-2">
            <Form.Label>Order</Form.Label>
            <Form.Select ref={orderRef} onChange={handleOrderChange}>
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Filter by</Form.Label>
            <Form.Select >
              <option value="all">All</option>
              <option value="correct">Correct</option>
              <option value="incorrect">Incorrect</option>
            </Form.Select>
          </Form.Group>
        </section>
        <section className="d-flex flex-column-reverse" id="results-section">
        {parsedQuizzes.map((quiz, index) => {
              return (
                  <QuizResult {...quiz} quiz={quiz} key={index}/>
                )
              })}
        </section>
        <div className="d-flex align-items-center justify-content-end my-4">
          <a href="#" className="nav-link p-1">Back to top</a>
        </div>
    </Container>
    </>
  )
}
