import { useState, useEffect } from 'react'
import { Container, Image } from "react-bootstrap"
import { useAuth } from '../contexts/AuthContext'
import { db } from "../firebase"
import { doc, getDoc } from "firebase/firestore";
import Navigation from '../Navigation'
import blankProfile from "../assets/blank-profile.jpg"

export default function MyAccount() {
const [wins, setWins] = useState(0)
const [total, setTotal] = useState(0)
const { currentUser, logout } = useAuth()

function handleLogout(e) {
  logout()
}

    //Get Quizzes from Database
    useEffect(() => {
    const fetchData = async () => {
        const docRef = doc(db, "users", currentUser.uid);
        try {
            const docSnap = await getDoc(docRef);
            setWins(docSnap.data().wins);
            setTotal(docSnap.data().totalQuizzes);
        } catch(error) {
            console.log(error)
        }
    }
    fetchData();
    },[])

  return (
    <>
        <Navigation/>
        <Container className='my-5'>
            <h1>My Account</h1>
            <div className='profile-wrapper d-flex flex-column align-items-center justify-content-center my-5'>
                <section className='profile-summary d-flex flex-column p-4' style={{border:"2px var(--orange-color) solid"}}>
                    <Image fluid src={currentUser.photoURL ? currentUser.photoURL : blankProfile} style={{
                        maxHeight:"100px",
                        maxWidth:"100px",
                        alignSelf:"center",
                        marginBottom:"2rem",
                        borderRadius:"3rem",
                        outline:"1px var(--text-color) dashed",
                        outlineOffset:"0.3rem"
                        }}/>
                    <div className='profile-text d-flex flex-column'>
                        <p>Name: {currentUser.email? currentUser.displayName : 'Demo User'}</p>
                        <p>Google Login: {currentUser.email? currentUser.email : 'N/A - Demo account.'}</p>
                        <p>Total Quizzes: {total}</p>
                        <p>Score: {total>0 ? `${((wins / total) * 100).toFixed(2)} %`: 'No Quizzes taken.'}</p>
                    </div>
                </section>
                <div className="links d-flex gap-4 my-5 w-100 justify-content-center">
                    <a href='/' className='nav-link py-1 px-2'>Quiz</a>
                    <a href='/results' className='nav-link py-1 px-2'>Results</a>
                    <a onClick={handleLogout} className='nav-link py-1 px-2'>Logout</a>
                </div>
            </div>
        </Container>
    </>
  )
}
