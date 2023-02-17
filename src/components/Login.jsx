import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from "react-router-dom"
import { Container, Image } from 'react-bootstrap'
import bannerLogo from "../assets/banner-logo.png"

export default function Login() {
    const { loginGoogle, loginDemo, getRedirect, currentUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState()
    const navigate = useNavigate()
    
    //Checks for Google Login result.
    getRedirect();
    
    //Sign in with Google.
    async function handleGoogleLogin(e) {
        e.preventDefault()
        try {
            setError('')
            await loginGoogle()
            getRedirect();
        } catch(error) {
            setError('Failed to create an account')
            console.log(error)
        }
    }

    //Login as Demo user
    async function handleDemoSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await loginDemo()
            navigate("/")
        } catch(error) {
            setError('Failed to create an account')
            console.log(error)
        }
        setLoading(false)
    }

    function handleClick() {
        if (currentUser) {
            navigate("/")
        } else {
            setMessage("To proceed, sign in.")
        }
    }

  return (
    <Container className='d-flex align-items-center justify-content-center flex-column vh-100' >
        <Image fluid src={bannerLogo} className="mb-5 banner-logo"/>
        <form onSubmit={handleGoogleLogin} className="mb-3">
            <button disabled={loading} type="submit" className='bg-transparent login-button px-3'>Sign in with Google <i className="fa-brands fa-google"></i></button>
        </form>
        <form onSubmit={handleDemoSubmit} className="mb-3">
            <button disabled={loading} type='submit' className='bg-transparent login-button px-3'>Sign in as <i>Demo</i> User</button>
        </form>
        {message && <p className='login-message m-0'>{message}</p>}
        <div className='w-100 text-center mt-2'>
            <a onClick={handleClick} className='fs-5' style={{cursor: "pointer"}}>Home</a>
        </div>
    </Container>
  )
}