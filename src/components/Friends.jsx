import React from 'react'
import Navigation from '../Navigation'
import { Container } from "react-bootstrap"

export default function () {
  return (
    <>
        <Navigation/>
        <Container className='my-5 text-center'>
            <h1 className='pt-5'>Coming Soon!</h1>
            <p className='mt-5 mb-4'>Check out the other pages for now...</p>
            <div className="links d-flex gap-4 w-100 justify-content-center">
                <a href='/' className='nav-link py-1 px-2'>Quiz</a>
                <a href='/results' className='nav-link py-1 px-2'>Results</a>
                <a href='/account' className='nav-link py-1 px-2'>My Account</a>
            </div>
        </Container>
    </>
  )
}
