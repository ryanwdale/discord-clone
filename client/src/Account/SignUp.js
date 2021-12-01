import React, { Component, useState } from 'react';
import { Button, Form, Header } from 'semantic-ui-react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const SignUp = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    let navigate = useNavigate();
   
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleDisplayNameChange = (e) => setDisplayName(e.target.value);

    const handleSubmit = (e) => {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        formData.append('display_name', displayName)

        axios
        .post('/api/accounts',formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(() => navigate("/"))
        .catch((e) => setErrorMessage(e.response.data.message));
    }

        return (
            <>
              <Header as="h1">Sign up</Header>
              <p>Please sign up with a username, password, and display name.</p>
         

            <Form onSubmit={handleSubmit}>
                {errorMessage && (<p>Error: {errorMessage}</p>)}
                <Form.Field>
                    <label>Username</label>
                    <Form.Input 
                    required 
                    name='username' 
                    placeholder='Username' 
                    onChange={handleUsernameChange} 
                />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <Form.Input required 
                    name='password' 
                    type='password' 
                    placeholder='Password' 
                    onChange={handlePasswordChange} 
                />
                </Form.Field>
                <Form.Field>
                    <label>Display Name</label>
                    <Form.Input required 
                    name='displayName' 
                    placeholder='Display Name' 
                    onChange={handleDisplayNameChange} 
                />    
                </Form.Field>
                <Button type='submit'>Submit</Button>
            </Form>
            </>
        )
    }


export default SignUp
