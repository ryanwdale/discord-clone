import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "semantic-ui-react";

const createInviteUrl = (serverId, code) => `/join/${serverId}?code=${code}`;
const createInviteLink = (url) => <a href={url}>invite link</a>;

const InviteModal = (props) => {
  const [inviteCode, setInviteCode] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const serverId = props.serverId;

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    axios
      .post(`/api/servers/${serverId}/invites`)
      .then((v) => setInviteCode(v.data.code))
      .catch((e) => setErrorMessage(e.response.data.message));
  }, [isModalOpen, serverId]);

  useEffect(() => {
    const inviteUrl = createInviteUrl(serverId, inviteCode);
    setInviteLink(createInviteLink(inviteUrl));
  }, [inviteCode, serverId]);

  return (
    <Modal
      trigger={<Button>Create invite</Button>}
      header="Server invite link"
      onOpen={() => setIsModalOpen(true)}
      onClose={() => setIsModalOpen(false)}
      content={
        errorMessage ? (
          errorMessage
        ) : (
          <Modal.Content>Your server {inviteLink}</Modal.Content>
        )
      }
      actions={[
        {
          key: "done",
          content: errorMessage ? "Okay" : "I've copied the link!",
          positive: true,
        },
      ]}
    />
  );
};

export default InviteModal;
