import './App.css';

import React from 'react';
import {BrowserRouter as Router, Link, Routes, Route} from "react-router-dom"
import { Container, Header } from 'semantic-ui-react';
import SignIn from './Account/SignIn'
import SignUp from './Account/SignUp'

function App() {
  return (
    <Router>
        <Container style={{ margin: '2em' }}>
          <Header as='h1'>Welcome to the project for CMPT 470 of group 1</Header>
          <Routes>
            <Route path="/" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
          </Routes>
        </Container>
    </Router>

  );
}

export default App;
