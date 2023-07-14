import axiosInstance from "../axios";
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import InputGroup from "react-bootstrap/InputGroup";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const centeredFormStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column',
};

const formStyle = {
  width: '500px', // Formun genişliğini ayarlayın
};

export default function LoginForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(''); // Add a state for the token

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = e.target.elements;

    try {
      const response = await axiosInstance.post('/login', {
        username: username.value,
        password: password.value,
      });
      const { token } = response.data;

      // Store the token in localStorage or session storage
      localStorage.setItem('token', token);

        // Print the token to the console
        console.log('Token:', token);


      // Redirect to the admin control page
      navigate('/home');
    } catch (error) {
      console.error(error);
      // Handle login error, show an error message, etc.
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid credentials. Please check your username and password.');
      } else {
        setErrorMessage('An error occurred during login. Please try again later.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={centeredFormStyle}>
      <h3 style={{ color: "red" }}>Restricted: Authorize to continue.</h3>
      <Form.Group controlId="formBasicEmail" style={formStyle}>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="text" placeholder="Enter email" name="username" />
              </Form.Group>
              <br />
              <Form.Group controlId="formBasicPassword" style={formStyle}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" name="password"/>
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3" style={formStyle}> 
                Login
              </Button>
      {errorMessage && <p>{errorMessage}</p>}
      </div>
    </form>
  );
}

