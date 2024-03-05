import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav, Form, Row, Col, Button, Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import { supabase, auth } from './supabase.js';

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function handleLogin() {
    try {
      const { error } = await auth.signIn({
        email: username,
        password: password
      });
  
      if (error) {
        throw error;
      } else {
        setErrorMessage("");
        setIsLoggedIn(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  

  return (
    <>
      <Navbar>
        <Container>
          <Navbar.Brand>My Login System</Navbar.Brand>
          <Nav>
            <Nav.Item>Created by Cooper Codes</Nav.Item>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        {!isLoggedIn ? (
          <Row className="justify-content-md-center">
            <Col xs={12} md={6}>
              <h3>Login</h3>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={username} onChange={(e) => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" onClick={handleLogin}>
                Login
              </Button>
            </Col>
          </Row>
        ) : (
          <Row className="justify-content-md-center">
            <Col xs={12} md={6}>
              <Alert variant="success">You are logged in!</Alert>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default App;
