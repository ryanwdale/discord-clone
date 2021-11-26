import React, { Component, useState } from "react";
import { Button, Form, Header } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  let navigate = useNavigate();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    axios
      .post("/api/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => navigate("/chat"))
      .catch((e) => setErrorMessage(e.response.data.message));
  };

  return (
    <>
      <Header as="h1"> Welcome to the project for CMPT 470 of group 1 </Header>
      <p>Please log in with your username and password.</p>
      <Form onSubmit={handleSubmit}>
     
        {errorMessage && <p> Error: {errorMessage} </p>}
        <Form.Field>
          <label> Username </label>
          <Form.Input
            required
            name="username"
            placeholder="Username"
            onChange={handleUsernameChange}
          />
        </Form.Field>
        <Form.Field>
          <label> Password </label>
          <Form.Input
            required
            name="password"
            type="password"
            placeholder="Password"
            onChange={handlePasswordChange}
          />
        </Form.Field>
        <Link to="/signup">
          <u> Sign up for an account </u>
          <br />
        </Link>
        <Button type="submit"> Sign In </Button>
      </Form>
    </>
  );
};

export default SignIn;
