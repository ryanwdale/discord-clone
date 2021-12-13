import "./App.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import SignIn from "./Account/SignIn";
import SignUp from "./Account/SignUp";
import JoinServer from "./Invites/JoinServer";
import Homepage from "./Chat/Homepage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<Homepage />} />
      </Routes>
      <Container style={{ margin: "2em" }}>
        <Routes>
          <Route exact path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/join/:serverId" element={<JoinServer />} />
          <Route path="*" element={<SignIn />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
