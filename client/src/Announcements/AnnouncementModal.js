import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "semantic-ui-react";
import getCsrfCookie from "../Account/GetCsrfCookie";
import CreateAnnoucenemtModal from "../Announcements/CreateAnnouncementModal"

const AnnouncementModal = (props) => {
  const [announcement, setAnnouncmenet] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);


  const serverId = props.serverId;


  return (


    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button content="Announcement" />}
    >
      <Modal.Header>Announcements for </Modal.Header>
        <Modal.Content> 
            {props.announcement}
            <CreateAnnoucenemtModal></CreateAnnoucenemtModal>
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

export default AnnouncementModal;
