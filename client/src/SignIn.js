import React, { Component } from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';
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
            'http://localhost:8080/api/login',
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
                <p>
                    You must log in to continue.
                </p>

                <Form onSubmit={this.handleSubmit}>
                    {this.state.errorMessage && (<p>Error: {this.state.errorMessage}</p>)}
                    <Form.Field>
                    <label>Username</label>
                    <Form.Input name='username' placeholder='Username' onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                    <label>Password</label>
                    <Form.Input name='password' type='password' placeholder='Password' onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                    <Checkbox label='I want to register an account with the information provided above' />
                    </Form.Field>
                    <Button type='submit'>Submit</Button>
                </Form>
            </>
        ) || <p>Welcome {this.state.username}</p>;
    }
}

export default SignIn
