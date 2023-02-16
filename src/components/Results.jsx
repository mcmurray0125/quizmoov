import { useState, useEffect } from "react"
import { Container, Form, Nav } from "react-bootstrap"
import { db } from "../firebase"
import { useAuth } from '../contexts/AuthContext'
import { doc, getDoc } from "firebase/firestore";
import Navigation from "../Navigation"
import QuizResult from "./QuizResult";

export default function Results() {
    const { currentUser } = useAuth()
    const [quizzes, setQuizzes] = useState([])
    const [wins, setWins] = useState(0)
    const [total, setTotal] = useState(0)
    const [parsedQuizzes, setParsedQuizzes] = useState([])
    const [filteredQuizzes, setFilteredQuizzes] = useState(parsedQuizzes)

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
      }, [quizzes]);

      //Test
      useEffect(() => {
        console.log(parsedQuizzes)
        console.log(wins)
        console.log(total)
      },[parsedQuizzes, wins, total])

  return (
    <>
    <Navigation />
    <Container>
        <div className="my-5 d-flex align-items-center justify-content-between">
            <h2 className="fs-2 m-0">My Quizzes:</h2>
            <p className="m-0" style={{color: "var(--orange-color)"}}>My score: <span style={{color: "var(--text-color)"}}>{wins} / {total}</span></p>
        </div>
        {parsedQuizzes.map((quiz, index) => {
              return (
                  <QuizResult {...quiz} quiz={quiz} key={index}/>
                )
              })}
    </Container>
    </>
  )
}
