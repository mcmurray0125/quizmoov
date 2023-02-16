import React from 'react'
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap"
import { useAuth } from './contexts/AuthContext'

export default function Navigation() {
  const { logout } = useAuth()

  function handleLogout(e) {
    logout()
  }

  return (
    <Navbar collapseOnSelect expand="md" variant="dark" className="w-100 top-0 py-3" id="navbar" style={{zIndex: "100"}}>
      <Container>
        <Navbar.Brand href="/">" QuizMoov "</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/leaderboards">Leaderboards</Nav.Link>
          </Nav>
          <Nav >
            <Nav.Link href="/">Play</Nav.Link>
            <Nav.Link href="/results">Results</Nav.Link>
            <NavDropdown title="Profile" id="collasible-nav-dropdown">
              <NavDropdown.Item eventKey={2} href="/profile">My Account</NavDropdown.Item>
              <NavDropdown.Item href="/results">Results</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/login">Login</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
