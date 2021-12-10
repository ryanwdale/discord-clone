import React, { useEffect, useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import CreateAnnouncementModal from "../Announcements/CreateAnnouncementModal"
import Announcement from "../Announcements/Announcement";

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
            <p>{props.announcementList.map((announcement)=>{
                return(
                    <Announcement
                        key={announcement.id}
                        channelId={props.channelId}
                        announcement={announcement.announcement}
                        isFromCurrentUser={props.activeUserId===announcement.user_id}
                        displayName={announcement.displayName}
                        announcementId={announcement.id}
                        timestamp={announcement.timestamp}
                    />
                )
            })}</p>
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
