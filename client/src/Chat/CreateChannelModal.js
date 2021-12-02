import React, { Component, useState } from "react";
import axios from "axios";
import { Button, Modal, Form, Message } from "semantic-ui-react";

const CreateChannelModal = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button content="Add Channel" />}
    >
      <Modal.Header>Add a Channel</Modal.Header>
      <Modal.Content>
        <CreateChannelForm
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

class CreateChannelForm extends Component {
  state = {
    channelName: "",
    errorMessage: "",
  };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };
  handleSubmit = () => {
    axios
      .post("/api/channels", {
        server_id: this.props.serverId,
        channel_name: this.state.channelName,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        this.props.updateChannels();
        // todo: close modal without reloading
        window.location.reload();
      })
      .catch((e) => this.setState({ errorMessage: e.response.data.message }));
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          required
          label="Channel Name"
          name="channelName"
          value={this.state.channelName}
          onChange={this.handleChange}
        />
        {this.state.errorMessage && (
          <Message
            error
            header="Error creating channel"
            content={this.state.errorMessage}
          />
        )}
        <Form.Button content="Submit" />
      </Form>
    );
  }
}

export default CreateChannelModal;
