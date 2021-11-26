import React, { Component } from 'react';
import { Button, Form, Header } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import axios from 'axios';

class SignIn extends Component{
    constructor(props) {
        super(props)
        this.state = {username: '', password: '', isLoggedIn: false, errorMessage: ''}
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleSubmit = (e) => {
        const formData = new FormData()
        formData.append('username', this.state.username)
        formData.append('password', this.state.password)

        axios.post(
            '/api/login',
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
        .then((v) => this.setState({isLoggedIn: true, username: v.data.username}))
        .catch((e) => this.setState({errorMessage: e.response.data.message}))
    }

    render() {
        return !this.state.isLoggedIn && (
            <>
                <Header as='h1'>Welcome to the project for CMPT 470 of group 1</Header>
                <p>
                    You must log in to continue.
                </p>
                <Form onSubmit={this.handleSubmit}>
                    {this.state.errorMessage && (<p>Error: {this.state.errorMessage}</p>)}
                    <Form.Field>
                        <label>Username</label>
                        <Form.Input required name='username' placeholder='Username' onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <Form.Input required name='password' type='password' placeholder='Password' onChange={this.handleChange} />
                    </Form.Field>
                    <Link to="/signup">
                        <u>Sign up for an account</u><br/>
                    </Link>
                    <Button type='submit'>Sign In</Button>
                </Form>
            </>
        ) || <meta http-equiv="refresh" content="0; url=/chat" />;

    }
}

export default SignIn
