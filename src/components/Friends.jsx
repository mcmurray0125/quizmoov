import { useState } from 'react'
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useAuth } from '../contexts/AuthContext'
import { db } from "../firebase"
import Navigation from '../Navigation'
import { Container, Form } from "react-bootstrap"

export default function () {
  const { currentUser } = useAuth()
  const [friendEmail, setFriendEmail] = useState()
  const [message, setMessage] = useState()
  const [requests, setRequests] = useState()

  const changeHandler = (e) => {
    setFriendEmail(e.target.value);
  }

  async function handleAddFriend(event) {
    event.preventDefault();
    const friendDocRef = doc(db, "friends", friendEmail);
    const friendDocSnap = await getDoc(friendDocRef);
    const myDocRef = doc(db, "friends", currentUser.email);
    const myDocSnap = await getDoc(myDocRef);
    if (!friendDocSnap.exists()) {
      setMessage("User not found")
    } else {
      try {
        await updateDoc(friendDocRef, {
          requests: arrayUnion(currentUser.email, "pending")
        }
        )
      } catch(error) {
          console.log(error)
      }
      try {
        await updateDoc(myDocRef, {
          sentInvites: arrayUnion({friendEmail})
          })
      } catch(error) {
          console.log(error)
      }
    }
    setFriendEmail("")
  }

  return (
    <>
        <Navigation/>
        <Container className='my-5'>
            <Form onSubmit={handleAddFriend} className="d-flex w-100 justify-content-between align-items-end gap-3">
              <Form.Group className="w-100" controlId="formBasicEmail">
                <Form.Label>Add friend by email:</Form.Label>
                <Form.Control onChange={changeHandler} type="email" aria-label='new-friend-email' placeholder="Enter email" className='email-input fs-2'/>
              </Form.Group>
              <button disabled={friendEmail ? false : true } className="invite-btn" type="submit">Send Invite</button>
            </Form>
            {message && <p className='mt-4 login-message'>{message}</p>}
            {requests && <h2 className='mb-4 text-decoration-underline'>My Requests:</h2>}
            <h2 className='mt-4 text-decoration-underline'>My Friends:</h2>
        </Container>
    </>
  )
}
