import React from 'react'
import Navigation from '../Navigation'
import { Container, Form, Button } from "react-bootstrap"

export default function () {
  return (
    <>
        <Navigation/>
        <Container className='my-5'>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Add friend by email:</Form.Label>
                <Form.Control type="email" placeholder="Enter email" className='email-input fs-2'/>
              </Form.Group>
              <button className="submit-btn" type="submit">Send Invite</button>
            </Form>
            <h2 className='mt-4 text-decoration-underline'>My Friends:</h2>
        </Container>
    </>
  )
}
