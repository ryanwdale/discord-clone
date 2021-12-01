import { Component } from "react";
import { Header } from "semantic-ui-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

import "./message.css";

class Message extends Component {
  render() {
    return (
      <div className="messageContainer">
        <div className="messageHeader">
          <Header as="h4">
            {this.props.displayName}
            <span className="messageTimeStamp">
              {format(new Date(this.props.timestamp), "MM/dd/yyyy H:mm")}
            </span>
          </Header>
        </div>
        <ReactMarkdown children={this.props.messageContent} />
      </div>
    );
  }
}
export default Message;
