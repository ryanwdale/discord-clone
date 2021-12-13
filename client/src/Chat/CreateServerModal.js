import React, { Component, useState } from "react";
import axios from "axios";
import { Button, Modal, Form, Message } from "semantic-ui-react";
import getCsrfCookie from "../Account/GetCsrfCookie";

const CreateServerModal = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button content="Create new server" />}
    >
      <Modal.Header>Create a new server</Modal.Header>
      <Modal.Content>
        <CreateServerForm
          onServerCreate={props.onServerCreate}
          closeModal={() => setOpen(false)}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          content="Close Window"
          onClick={() => setOpen(false)}
        />
      </Modal.Actions>
    </Modal>
  );
};

class CreateServerForm extends Component {
  state = {
    server_name: "",
    errorMessage: "",
  };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    const formData = new FormData();
    formData.append("server_name", this.state.server_name);
    axios
      .post(`/api/servers`, formData, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": getCsrfCookie(),
        },
      })
      .then((res) => {
        e.preventDefault();
        this.props.closeModal();
        this.props.onServerCreate(res.data);
      });
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          required
          label="Server Name"
          name="server_name"
          maxLength="60"
          value={this.state.server_name}
          onChange={this.handleChange}
        />
        {this.state.errorMessage && (
          <Message
            error
            header="Error creating server"
            content={this.state.errorMessage}
          />
        )}
        <Form.Button content="Submit" />
      </Form>
    );
  }
}

export default CreateServerModal;
