import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const SignOut = (props) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    props.socket.emit("logout");

    axios
      .post("/api/logout")
      .then((v) => navigate("/"))
      .catch((e) => setErrorMessage(e.response.data.message));
  }, [isModalOpen, navigate, props.socket]);

  return (
    <Modal
      trigger={<Button>Sign Out</Button>}
      header="Sign Out"
      onOpen={() => setIsModalOpen(true)}
      onClose={() => setIsModalOpen(false)}
      content={
        errorMessage ? (
          errorMessage
        ) : (
          <Modal.Content>Signing Out...</Modal.Content>
        )
      }
    />
  );
};

export default SignOut;
