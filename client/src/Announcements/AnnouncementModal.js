import React, { useEffect, useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import CreateAnnouncementModal from "../Announcements/CreateAnnouncementModal"

const AnnouncementModal = (props) => {
  const [open, setOpen] = useState(false);

  return (

    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button content="Announcement" />}
    >
      <Modal.Header>Announcements for {props.channelName}</Modal.Header>
        <Modal.Content> 
            <p>{props.announce}</p>
            <CreateAnnouncementModal 
                channelId={props.channelId}
                channelName={props.channelName}
                updateAnnouncements={props.updateAnnouncements}
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

export default AnnouncementModal;
