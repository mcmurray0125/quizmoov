import React, { useState } from 'react'
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from "react-router-dom"
import { Container } from 'react-bootstrap'


export default function Signup() {
    const { loginGoogle, loginDemo } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    //Sign Up Email and Password
    async function handleGoogleLogin(e) {
        e.preventDefault()
        try {
            setError('')
            setLoading(true)
            await loginGoogle()
            navigate("/")
        } catch(error) {
            setError('Failed to create an account')
            console.log(error)
        }
        setLoading(false)
    }
    //Login Demo
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

  return (
    <Container className='d-flex align-items-center justify-content-center flex-column vh-100' >
        <Form onSubmit={handleGoogleLogin} className="mb-3">
            <Button disabled={loading} type='submit'>Sign in With Google</Button>
        </Form>
        <Form onSubmit={handleDemoSubmit} className="mb-3">
            <Button disabled={loading} type='submit'>Sign in as Demo User</Button>
        </Form>
        <div className='w-100 text-center mt-2'>
            <Link to="/">Home</Link>
        </div>
    </Container>
  )
}