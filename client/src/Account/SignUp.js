import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';
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
            'http://localhost:8080/api/accounts',
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
            </Form>
        )
    }
}

export default SignUp