import { useState, useEffect, useRef } from "react"
import { Container, Form, Nav } from "react-bootstrap"
import { db } from "../firebase"
import { useAuth } from '../contexts/AuthContext'
import { doc, getDoc } from "firebase/firestore";
import Navigation from "../Navigation"
import QuizResult from "./QuizResult";
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"

import "../styles/results.scss"

export default function Results() {
    const { currentUser } = useAuth()
    const [quizzes, setQuizzes] = useState([])
    const [wins, setWins] = useState(0)
    const [total, setTotal] = useState(0)
    const [parsedQuizzes, setParsedQuizzes] = useState([])
    const [filter, setFilter] = useState("all")
    //userData state for Chart.js bar graph
    const orderRef= useRef();
    const filterRef= useRef();
    const [userData, setUserData] = useState({
      labels: ["Correct", "Incorrect", "Total"],
      datasets: [{
        label: "Results",
        data: [wins, total - wins, total]
      }]
    })
    
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

      //Changes filter state to filter quizzes by Correct, Incorrect, or All quizzes.
      function handleFilterChange() {
        if (filterRef.current.value === "all") {
          setFilter("all")
        }
        if (filterRef.current.value === "correct") {
          setFilter("correct")
        }
        if (filterRef.current.value === "incorrect") {
          setFilter("incorrect")
        }
      }

  return (
    <>
    <Navigation />
    <Container className='results-page'>
        <header className="d-flex justify-content-between results-header">
            <h2 className="fs-2 m-0">My Quizzes:</h2>
            <div style={{width: "300px"}} className="bar-graph">
              <Bar data={userData} options={options}/>
            </div>
            <p className="m-0" style={{color: "var(--orange-color)"}}>My score: <span style={{color: "var(--text-color)", whiteSpace: "nowrap"}}>{total>0 ? `${((wins / total) * 100).toFixed(2)}%`: 'No Quizzes taken.'}</span></p>
        </header>
        <section className="sort-wrapper d-flex justify-content-end gap-2">
          <Form.Group className="mb-2">      
            <Form.Select ref={orderRef} onChange={handleOrderChange} className="quiz-filters">
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">    
            <Form.Select ref={filterRef} onChange={handleFilterChange} className="quiz-filters">
              <option value="all">All</option>
              <option value="correct">Correct ({wins})</option>
              <option value="incorrect">Incorrect ({total-wins})</option>
            </Form.Select>
          </Form.Group>
        </section>
        <section className="d-flex flex-column-reverse gap-3 mt-3 mx-auto col-lg-6" id="results-section">
        {parsedQuizzes.map((quiz, index) => {
              return (
                  <QuizResult {...quiz} quiz={quiz} key={index} filter={filter}/>
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
