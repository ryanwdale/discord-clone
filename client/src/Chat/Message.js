import { Button, Header } from "semantic-ui-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

import "./message.css";

const Message = (props) => {
  const deleteMessage = () => {
    props.socket.emit("delete message", {
      channel_id: props.channelId,
      message_id: props.messageId,
    });
  };

  return (
    <div className="messageContainer">
      <div className="messageHeader">
        <Header as="h4">
          {props.displayName}
          <span className="messageTimeStamp">
            {format(new Date(props.timestamp), "MM/dd/yyyy H:mm")}
          </span>
          {props.isFromCurrentUser && (
            <Button size="mini" onClick={deleteMessage}>
              Delete message
            </Button>
          )}
        </Header>
      </div>
      <ReactMarkdown children={props.messageContent} />
    </div>
  );
};

export default Message;
