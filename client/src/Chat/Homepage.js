import { Component } from "react";
import axios from "axios";

import Chatroom from "./Chatroom";
import Sidebar from "./Sidebar";
import "./homepage.css";
import io from "socket.io-client";

const convertServerListToOptions = (serverList) => {
  return serverList.map((server) => ({
    key: server.id,
    value: server.id,
    text: server.server_name,
  }));
};

class Homepage extends Component {
  constructor() {
    super();
    this.state = {
      channelList: [],
      activeChannelId: null,
      activeChannelName: null,
      serverList: [],
      activeServerId: null,
      activeMessage: "",
      activeChat: [],
      accountId: null,
    };
    this.socket = io();
    this.socket.on("client message", (message) => {
      console.log(message);
      // todo: add message to activeChat
    });

    this.socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket.connect();
      }
      // else the socket will automatically try to reconnect
    });
  }

  componentDidMount() {
    this.fetchCurrentAccount();
  }

  fetchChannelData = () => {
    if (this.state.activeChannelId !== null) {
      axios
        .get(`/api/channels/${this.state.activeChannelId}/messages`)
        .then((res) => {
          this.setState(
            {
              activeMessage: "",
              activeChat: res.data,
            },
            () => {
              // We also want to scroll to the latest message, we want to do this after we set state so the div is on the right height
              // from https://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
              let chatMessages = document.getElementById("chatMessages");
              chatMessages.scrollTop = chatMessages.scrollHeight;
            }
          );
        })
        .catch((e) => alert(e.response.data.message));
    }
  };

  onChannelSelect = (e, id, name) => {
    // We want to fetch the latest messages for the selected channels as well
    if (id !== this.state.activeChannelId) {
      this.socket.emit("leave", { channel_id: this.state.activeChannelId });
      this.setState({ activeChannelId: id, activeChannelName: name }, () => {
        this.socket.emit("join", { channel_id: id });
        this.fetchChannelData();
      });
    }
  };

  fetchCurrentAccount = () => {
    axios
      .get("/api/currentAccount", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((v) => {
        this.setState({
          accountId: v.data.id,
          displayName: v.data.display_name,
          serverList: v.data.servers,
        });
      });
    // todo: navigate to signin on error
  };

  updateChannels = () => {
    if (this.state.activeServerId) {
      axios
        .get(`/api/servers/${this.state.activeServerId}/channels`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((v) => this.setState({ channelList: v.data }))
        .catch((e) => alert(e.response.data.message));
    }
  };

  handleInputChange = (value) => this.setState({ activeMessage: value });
  onServerSelect = (e, data) => {
    this.setState({ activeServerId: data.value }, () => {
      this.updateChannels();
      this.fetchChannelData();
    });
  };

  handleSubmitMessage = (e) => {
    e.preventDefault();

    // Should talk to Socket and DB to update messageList instead of directly
    // updating messageList
    if (this.state.activeMessage.length) {
      // Broadcast message, maybe this should save to DB then we don't need the post?
      this.socket.emit("server message", {
        message: this.state.activeMessage,
        room: this.state.activeChannelId,
      });
      // Send the message to the DB
      const formData = new FormData();
      formData.append("message_content", this.state.activeMessage);

      axios
        .post(
          `/api/channels/${this.state.activeChannelId}/messages`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          this.fetchChannelData(this.state.activeChannelId);
        })
        .catch((e) => alert(e.response.data.message));
    }
  };

  render() {
    return (
      <div className="homeContainer">
        <div className="sidebarContainer">
          <Sidebar
            className="sidebar"
            displayName={this.state.displayName}
            channelList={this.state.channelList}
            onChannelSelect={this.onChannelSelect}
            onServerSelect={this.onServerSelect}
            activeServerId={this.state.activeServerId}
            activeItem={this.state.activeChannelId}
            updateChannels={this.updateChannels}
            serverList={convertServerListToOptions(this.state.serverList)}
          />
        </div>
        <div className="chatroomContainer">
          <Chatroom
            className="chatroom"
            channelName={this.state.activeChannelName}
            activeMessage={this.state.activeMessage}
            messageList={this.state.activeChat}
            handleChange={this.handleInputChange}
            handleSubmitMessage={this.handleSubmitMessage}
          />
        </div>
      </div>
    );
  }
}
export default Homepage;
