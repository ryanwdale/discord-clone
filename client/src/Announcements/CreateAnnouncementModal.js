import React, { Component, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Message } from 'semantic-ui-react';
import getCsrfCookie from "../Account/GetCsrfCookie";

const CreateAnnouncementModal = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button content="Create new announcement" />}
    >
      <Modal.Header>Create a New Announcement</Modal.Header>
      <Modal.Content>
        <CreateAnnouncementForm 
          channelId={props.channelId}
          updateChannels={props.updateChannels}
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

class CreateAnnouncementForm extends Component {

  state = {
    announcement: "",
    errorMessage: ""
  };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };
  
  handleSubmit = (e) => {
    const formData = new FormData();
    formData.append("announcement", this.state.announcement);
    axios
      .post(`/api/channels/${this.props.channelId}/announcements`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": getCsrfCookie()
          },
        }
      )
      .then(() => {
        e.preventDefault();
        this.props.closeModal();
        window.location.reload();
      })
  };

  render() {

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          required
          label="Announcement"
          name="announcement"
          value={this.state.announcement}
          onChange={this.handleChange}
        />
        {this.state.errorMessage && (
          <Message
            error
            header="Error creating Announcement"
            content={this.state.errorMessage}
          />
        )
        }
        <Form.Button content="Submit" />
      </Form>
    );
  }
}

export default CreateAnnouncementModal;
