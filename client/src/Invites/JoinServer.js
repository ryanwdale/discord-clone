import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import getCsrfCookie from "../Account/GetCsrfCookie";

const SuccessMessage = (props) => {
  return (
    <div>
      <p>Congratulations, you are now in server {props.serverId}.</p>
      <Link to="/chat">Take me back to the chats!</Link>
    </div>
  );
};

const ErrorMessage = (props) => {
  return <p>Sorry, invite link is invalid ({props.message}).</p>;
};

const JoinServer = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [joinedServer, setJoinedServer] = useState(false);

  const { serverId } = useParams();

  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const inviteCode = query.get("code");

  useEffect(() => {
    const formData = new FormData();
    formData.append("server_id", serverId);
    formData.append("code", inviteCode);

    axios
      .put("/api/accounts/0/servers", formData, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": getCsrfCookie()
        },
      })
      .then(() => setJoinedServer(true))
      .catch((e) => {
        setErrorMessage(e.response.data.message || "Could not join server");
        setJoinedServer(false);
      });
  }, [serverId, inviteCode]);

  if (joinedServer) {
    return <SuccessMessage serverId={serverId} />;
  } else if (errorMessage) {
    return <ErrorMessage message={errorMessage} />;
  } else {
    return <p>Attempting to join server... Please wait.</p>;
  }
};

export default JoinServer;
