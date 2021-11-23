import './App.css';

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { Container } from 'semantic-ui-react';
import SignIn from './Account/SignIn'
import SignUp from './Account/SignUp'
import Homepage from './Chat/Homepage';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/chat" element={<Homepage/>}/>
        </Routes>
        <Container style={{ margin: '2em' }}>
          <Routes>
            <Route path="/" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
          </Routes>
        </Container>
    </Router>

  );
}

export default App;
