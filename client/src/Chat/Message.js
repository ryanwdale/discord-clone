import { Header, Icon } from "semantic-ui-react";
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
        </Header>
        {props.isFromCurrentUser && (
            <Icon name="trash alternate outline" className="trash-button" onClick={deleteMessage} />
          )}
      </div>
      <ReactMarkdown children={props.messageContent} />
    </div>
  );
};

export default Message;
