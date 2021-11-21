import logo from './logo.svg';
import './App.css';

import { Button, Checkbox, Container, Form, Header } from 'semantic-ui-react';

function App() {
  return (
    <Container style={{ margin: '2em' }}>
      <Header as='h1'>Welcome to the project for CMPT 470 of group 1</Header>

      <p>
        You must login to continue.
      </p>

      <Form>
        <Form.Field>
          <label>Username</label>
          <input placeholder='Username' />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input placeholder='Password' />
        </Form.Field>
        <Form.Field>
          <Checkbox label='I want to register an account with the information provided above' />
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>
    </Container>
  );
}

export default App;
