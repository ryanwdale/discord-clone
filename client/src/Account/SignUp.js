import React, { Component } from 'react';
import { Button, Form, Header } from 'semantic-ui-react';
import axios from 'axios';

class SignUp extends Component{
    constructor(props) {
        super(props)
        this.state = {username: '', password: '', displayName: '', errorMessage: ''}
    }

   

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleSubmit = (e) => {
        const formData = new FormData()
        formData.append('username', this.state.username)
        formData.append('password', this.state.password)
        formData.append('display_name', this.state.displayName)

        axios.post(
            '/api/accounts',
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
        .catch((e) => this.setState({errorMessage: e.response.data.message}))
    }

    render() {
        return (
            <>
      <Header as="h1"> Sign Up</Header>
      <p>Please Sign up with a Username, Password, and Display Name.</p>
         

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
                <Form.Field>
                    <label>Display Name</label>
                    <Form.Input required name='displayName' placeholder='Display Name' onChange={this.handleChange} />
                    
                </Form.Field>
                <Button type='submit'>Submit</Button>
                <Button type='button' href="/">Return to login page</Button>
            </Form>
            </>
        )
    }
}

export default SignUp
