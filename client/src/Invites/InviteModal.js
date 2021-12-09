import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Input, Modal } from "semantic-ui-react";
import getCsrfCookie from "../Account/GetCsrfCookie";

const InviteModal = (props) => {
  const [inviteCode, setInviteCode] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const createInviteUrl = (serverId, code) =>
    `${window.location.origin}/join/${serverId}?code=${code}`;

  const serverId = props.serverId;

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    axios
      .post(
        `/api/servers/${serverId}/invites`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": getCsrfCookie(),
          },
        }
      )
      .then((v) => setInviteCode(v.data.code))
      .catch((e) => setErrorMessage(e.response.data.message));
  }, [isModalOpen, serverId]);

  useEffect(() => {
    setInviteUrl(createInviteUrl(serverId, inviteCode));
    setIsCopied(false);
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
          <Modal.Content>
            <p>
              Share the following server invite link with your friends.
              Note: this server link expires in 7 days
            </p>
            <Input
              fluid
              action={{
                color: !isCopied ? "green" : "lightgrey",
                labelPosition: "right",
                icon: "copy",
                content: !isCopied ? "Copy" : "Copied!",
                onClick: () => {
                  navigator.clipboard.writeText(inviteUrl);
                  setIsCopied(true);
                },
              }}
              value={inviteUrl}
            />
          </Modal.Content>
        )
      }
      actions={[
        {
          key: "done",
          content: errorMessage ? "Okay" : "I've copied the link!",
          positive: isCopied,
        },
      ]}
    />
  );
};

export default InviteModal;
