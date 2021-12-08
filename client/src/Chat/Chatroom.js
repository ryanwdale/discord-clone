import { Component } from "react";
import { Header, Button } from "semantic-ui-react";
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
          {this.props.showAnalytics ?
            <Button className="analytics_btn" onClick={this.props.toggleShowAnalytics}>Back</Button> :
            <>
              <Button className="analytics_btn" onClick={this.props.fetchChannelAnalytics}>View Channel Analytics</Button>
              <Search
                activeSearchMessage={this.props.activeSearchMessage}
                handleSearchChange={this.props.handleSearchChange}
                handleSubmitSearchMessage={this.props.handleSubmitSearchMessage}
              /> 
            </>
          }
        </div>
        {this.props.showAnalytics ? 
          <div className="analytics_div">
            <Header as="h3">Channel analytics</Header>
            {this.props.analytics.user_stats && 
              <div className="analytics_inner_div">
                  <Header as="h3">Top users and their message counts:</Header>
                  {this.props.analytics.user_stats.map(user_stat => {
                    return (
                      <>
                        <span key={user_stat[0]} className="analytics_text">{user_stat[0]} sent {user_stat[1]} messages</span>
                        <br/>
                      </>
                    )
                  })}
              </div>}
            {this.props.analytics.wordcount_stats && 
              <div className="analytics_inner_div">
                  <Header as="h3">Top words used in this channel:</Header>
                  {this.props.analytics.wordcount_stats.map(wordcount_stat => {
                    return (
                      <>
                        <span key={wordcount_stat[0]} className="analytics_text">"{wordcount_stat[0]}" occurred {wordcount_stat[1]} times</span>
                        <br/>
                      </>
                    )
                  })}
              </div>}
          </div> :
          <>
            <div id="chatMessages" className="chatMessages">
              {this.props.messageList.length !== 0 &&
                this.props.messageList.map((message) => {
                  return (
                    <Message
                      key={message.id}
                      channelId={this.props.channelId}
                      messageId={message.id}
                      isFromCurrentUser={this.props.activeUserId === message.user_id}
                      displayName={message.display_name}
                      timestamp={message.timestamp}
                      messageContent={message.message_content}
                      socket={this.props.socket}
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
          </>}
      </div>
    );
  }
}
export default Chatroom;
