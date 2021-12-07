import React, { Component, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Message } from 'semantic-ui-react';


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
          serverId={props.serverId}
          updateChannels={props.updateChannels}
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
    errorMessage: ""
  };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };
  handleSubmit = () => {
    axios
      .post(
        "/api/servers",
        {
          
          server_name: this.state.server_name,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      
      .then(() => {
        this.props.updateChannels();
        // todo: close modal without reloading
        window.location.reload();
      })
     
  }

  render() {

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          required
          label="Server Name"
          name="server_name"
          value={this.state.server_name}
          onChange={this.handleChange}
        />
        {this.state.errorMessage && (
          <Message
            error
            header="Error creating server"
            content={this.state.errorMessage}
          />
        )
        }
        <Form.Button content="Submit" />
      </Form>
    );
  }
}

export default CreateServerModal;
