import axios from "axios";
import { Component, useEffect, useState } from "react";
import { Button, Header, Icon, Message as Banner } from "semantic-ui-react";

import "./chatroom.css";
import Message from "./Message";
import Search from "./Search";

const Chatroom = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const handleSearchChange = (query) =>
    query === "" ? resetSearch() : setSearchQuery(query);

  const handleSubmitSearchMessage = (e) => {
    e.preventDefault();

    if (searchQuery === "") {
      return;
    }

    setActiveSearchQuery(searchQuery);

    axios
      .get(`/api/channels/${props.channelId}/messages/search`, {
        params: {
          query: searchQuery,
        },
      })
      .then((res) => {
        setSearchResults(res.data);
      })
      .catch(() => props.updateChannels(true));
  };

  const resetSearch = () => {
    setSearchQuery(""), setActiveSearchQuery(""), setSearchResults(null);
  };
  const disabledSearchMessage =
    "Chat is disabled in search mode. Clear search query to continue chatting";
  useEffect(resetSearch, [props.channelId]);

  return (
    <div className="chatroom">
      <div className="channelTopBar">
        {(!props.channelId && (
          <Banner
            id="no-selected-channel-banner"
            warning
            icon="exclamation circle"
            header="No channel selected"
            content="You must select a server in the left sidebar, and also one of the channels. You may create a new server and/or a new channel with the appropriate buttons in the sidebar."
          />
        )) || (
          <>
            <div className="headerContainer">
              <Header as="h2">{props.channelName}</Header>
            </div>

            {props.showAnalytics ? (
              <Button
                className="analytics_btn"
                onClick={props.toggleShowAnalytics}
              >
                Back
              </Button>
            ) : (
              <>
                {props.channelId !== null && (
                  <Icon
                    className="trash-button"
                    name="trash alternate outline"
                    onClick={props.deleteChannel}
                  />
                )}
                <Button
                  className="analytics_btn"
                  onClick={props.fetchChannelAnalytics}
                >
                  View Channel Analytics
                </Button>
                <Search
                  activeSearchMessage={searchQuery}
                  handleSearchChange={handleSearchChange}
                  handleSubmitSearchMessage={handleSubmitSearchMessage}
                />
              </>
            )}
          </>
        )}
      </div>
      {props.showAnalytics ? (
        <div className="analytics_div">
          <Header as="h3">Channel analytics</Header>
          {props.analytics.user_stats && (
            <div className="analytics_inner_div">
              <Header as="h3">Top users and their message counts:</Header>
              {props.analytics.user_stats.map((user_stat) => {
                return (
                  <>
                    <span key={user_stat[0]} className="analytics_text">
                      {user_stat[0]} sent {user_stat[1]} messages
                    </span>
                    <br />
                  </>
                );
              })}
            </div>
          )}
          {props.analytics.wordcount_stats && (
            <div className="analytics_inner_div">
              <Header as="h3">Top words used in channel:</Header>
              {props.analytics.wordcount_stats.map((wordcount_stat) => {
                return (
                  <>
                    <span key={wordcount_stat[0]} className="analytics_text">
                      "{wordcount_stat[0]}" occurred {wordcount_stat[1]} times
                    </span>
                    <br />
                  </>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          <div id="chatMessages" className="chatMessages">
            {(searchResults !== null &&
              ((searchResults.length !== 0 &&
                searchResults.map((message) => (
                  <Message
                    key={message.id}
                    channelId={props.channelId}
                    messageId={message.id}
                    isFromCurrentUser={props.activeUserId === message.user_id}
                    disableMessageDelete={true}
                    displayName={message.display_name}
                    timestamp={message.timestamp}
                    messageContent={message.message_content}
                    socket={props.socket}
                  />
                ))) || (
                <Banner warning icon="exclamation circle">
                  <Icon name="exclamation circle" />
                  <Banner.Content>
                    <Banner.Header>No results found</Banner.Header>
                    Your query for "{activeSearchQuery}" returned no results
                  </Banner.Content>
                </Banner>
              ))) ||
              (props.messageList.length !== 0 &&
                props.messageList.map((message) => {
                  return (
                    <Message
                      key={message.id}
                      channelId={props.channelId}
                      messageId={message.id}
                      isFromCurrentUser={props.activeUserId === message.user_id}
                      displayName={message.display_name}
                      timestamp={message.timestamp}
                      messageContent={message.message_content}
                      socket={props.socket}
                    />
                  );
                }))}
          </div>
          <div className="chatInput">
            <form onSubmit={(e) => props.handleSubmitMessage(e)}>
              <input
                disabled={!!activeSearchQuery || !props.channelId}
                placeholder={
                  !props.channelId
                    ? "You must select a channel before chatting"
                    : activeSearchQuery
                    ? disabledSearchMessage
                    : "Send message to " + props.channelName
                }
                onChange={(event) => props.handleChange(event.target.value)}
                value={activeSearchQuery ? "" : props.activeMessage}
              />
              <button type="submit" className="chatInputSubmit">
                send message
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
export default Chatroom;
