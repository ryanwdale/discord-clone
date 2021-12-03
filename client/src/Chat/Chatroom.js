import { Component } from "react";
import { Header } from "semantic-ui-react";
import "./chatroom.css";
import Message from "./Message";
import Search from "./Search"

class Chatroom extends Component {
  render() {
    return (
      <div className="chatroom">
        <div className="channelTopBar">
          <div className="headerContainer">
            <Header as="h2">{this.props.channelName}</Header>
          </div>
          <Search
            activeSearchMessage={this.props.activeSearchMessage}
            handleSearchChange={this.props.handleSearchChange}
            handleSubmitSearchMessage={this.props.handleSubmitSearchMessage}
          />
        </div>
        <div id="chatMessages" className="chatMessages">
          {this.props.messageList.length !== 0 &&
            this.props.messageList.map((message) => {
              return (
                <Message
                  key={message.id}
                  displayName={message.display_name}
                  timestamp={message.timestamp}
                  messageContent={message.message_content}
                />
              );
            })}
        </div>
        <div className="chatInput">
          <form onSubmit={(e) => this.props.handleSubmitMessage(e)}>
            <input
              placeholder={"Send message to " + this.props.channelName}
              onChange={(event) => this.props.handleChange(event.target.value)}
              value={this.props.activeMessage}
            />
            <button type="submit" className="chatInputSubmit">
              send message
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default Chatroom;
