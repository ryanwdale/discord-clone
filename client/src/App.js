import './App.css';

import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import SignIn from './SignIn'

function App() {
  return (
    <Container style={{ margin: '2em' }}>
      <Header as='h1'>Welcome to the project for CMPT 470 of group 1</Header>
      <SignIn />
    </Container>
  );
}

export default App;
