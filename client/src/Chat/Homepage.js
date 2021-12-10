import { Component } from "react";
import axios from "axios";
import { Modal } from "semantic-ui-react";

import Chatroom from "./Chatroom";
import Sidebar from "./Sidebar";
import "./homepage.css";
import io from "socket.io-client";
import getCsrfCookie from "../Account/GetCsrfCookie";

const convertServerListToOptions = (serverList) => {
  return serverList.map((server) => ({
    key: server.id,
    value: server.id,
    text: server.server_name,
  }));
};

const scrollToTop = () => {
  // We also want to scroll to the latest message, we want to do this after we set state so the div is on the right height
  // from https://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
  let chatMessages = document.getElementById("chatMessages");
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

class Homepage extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: true,
      channelList: [],
      activeChannelId: null,
      activeChannelName: null,
      serverList: [],
      activeServerId: null,
      activeMessage: "",
      activeChat: [],
      accountId: null,
      showAnalytics: false,
      analytics: null,
    };
    this.socket = io();
    this.socket.on("client message", (message) => {
      message = JSON.parse(message);
      this.setState(
        (prevState) => ({ activeChat: [...prevState.activeChat, message] }),
        scrollToTop
      );
    });

    this.socket.on("delete message", (messageId) => {
      this.setState((prevState) => {
        const chatMessages = prevState.activeChat.filter(
          (message) => message.id !== messageId
        );
        return { activeChat: chatMessages };
      }, scrollToTop);
    });

    this.socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket.connect();
      }
      // else the socket will automatically try to reconnect
    });

    this.socket.on("logout", () => {
      this.socket.disconnect();
      this.setState({ loggedIn: false });
    });
  }

  componentDidMount() {
    this.fetchCurrentAccount();
  }

  componentWillUnmount() {
    this.socket.emit("leave", { channel_id: this.state.activeChannelId });
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
        .catch(() => this.updateChannels(true));
    }
  };

  onChannelSelect = (e, id, name) => {
    // We want to fetch the latest messages for the selected channels as well
    if (id !== this.state.activeChannelId) {
      this.socket.emit("leave", { channel_id: this.state.activeChannelId });
      this.setState({ showAnalytics: false }, () => {
        this.selectChannel(id, name);
      });
    }
  };

  onServerCreate = (newServerInfo) => {
    this.setState(
      (prevState) => ({
        serverList: [...prevState.serverList, newServerInfo],
      }),
      () => {
        if (this.state.serverList.length === 1) {
          this.setState({
            activeServerId: newServerInfo.id,
          });
        }
      }
    );
  };

  selectChannel = (id, name) => {
    this.setState({ activeChannelId: id, activeChannelName: name }, () => {
      this.socket.emit("join", { channel_id: id });
      this.fetchChannelData();
    });
  };

  fetchCurrentAccount = () => {
    axios
      .get("/api/currentAccount", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((v) => {
        this.socket.emit("login");
        this.setState(
          {
            accountId: v.data.id,
            displayName: v.data.display_name,
            serverList: v.data.servers,
          },
          () => {
            if (this.state.serverList.length) {
              this.setState(
                {
                  activeServerId: this.state.serverList[0].id,
                },
                () => {
                  this.updateChannels();

                  if (!this.state.activeChannelId) {
                    const activeServer = this.state.serverList[0];

                    if (activeServer.channels.length) {
                      const activeChannel = activeServer.channels[0];
                      this.selectChannel(activeChannel.id, activeChannel.name);
                    }
                  }
                }
              );
            }
          }
        );
      })
      .catch(() => this.setState({ loggedIn: false }));
  };

  updateChannels = (selectFirstChannel = false) => {
    if (this.state.activeServerId) {
      axios
        .get(`/api/servers/${this.state.activeServerId}/channels`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((v) =>
          this.setState({ channelList: v.data }, () => {
            if (selectFirstChannel || this.state.activeChannelId === null) {
              this.selectFirstChannel();
            }
          })
        )
        .catch((e) => alert(e.response.data.message));
    }
  };

  fetchChannelAnalytics = () => {
    axios
      .get(`/api/channels/${this.state.activeChannelId}/analytics`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        this.setState({ showAnalytics: true, analytics: res.data });
      })
      .catch((e) => alert(e.response.data.message));
  };

  toggleShowAnalytics = () => {
    this.setState({ showAnalytics: false }, scrollToTop);
  };

  selectFirstChannel = () => {
    if (this.state.channelList.length) {
      const channel = this.state.channelList[0];
      this.selectChannel(channel.id, channel.name);
    } else {
      this.setState({
        activeChannelId: null,
        activeChannelName: null,
        activeMessage: "",
        activeChat: [],
      });
    }
  };

  deleteChannel = () => {
    axios
      .delete(`/api/channels/${this.state.activeChannelId}`, {
        headers: {
          "X-CSRF-TOKEN": getCsrfCookie(),
        },
      })
      .then(() => {
        this.socket.emit("leave", { channel_id: this.state.activeChannelId });
        this.updateChannels(true);
      })
      .catch((e) => alert(e.response.data.message));
  };

  handleInputChange = (value) => this.setState({ activeMessage: value });
  onServerSelect = (e, data) => {
    this.setState({ activeServerId: data.value, showAnalytics: false, activeChannelId: null }, () => {
      this.updateChannels(true);
      this.fetchChannelData();
    });
  };

  handleSubmitMessage = (e) => {
    e.preventDefault();

    if (this.state.activeMessage.length) {
      const formData = new FormData();
      formData.append("message_content", this.state.activeMessage);
      axios
        .post(
          `/api/channels/${this.state.activeChannelId}/messages`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": getCsrfCookie(),
            },
          }
        )
        .then(() => this.setState({ activeMessage: "" }))
        .catch(() => this.updateChannels(true));
    }
  };

  render() {
    return (
      <div className="homeContainer">
        <Modal open={!this.state.loggedIn}>
          <Modal.Content>
            You are not logged in. Please <a href="/">sign in here</a>
          </Modal.Content>
        </Modal>
        <div className="sidebarContainer">
          <Sidebar
            className="sidebar"
            displayName={this.state.displayName}
            channelList={this.state.channelList}
            onChannelSelect={this.onChannelSelect}
            onServerSelect={this.onServerSelect}
            onServerCreate={this.onServerCreate}
            activeServerId={this.state.activeServerId}
            activeItem={this.state.activeChannelId}
            updateChannels={this.updateChannels}
            serverList={convertServerListToOptions(this.state.serverList)}
            socket={this.socket}
          />
        </div>
        <div className="chatroomContainer">
          <Chatroom
            className="chatroom"
            channelId={this.state.activeChannelId}
            channelName={this.state.activeChannelName}
            activeUserId={this.state.accountId}
            activeMessage={this.state.activeMessage}
            messageList={this.state.activeChat}
            fetchChannelAnalytics={this.fetchChannelAnalytics}
            showAnalytics={this.state.showAnalytics}
            toggleShowAnalytics={this.toggleShowAnalytics}
            analytics={this.state.analytics}
            handleChange={this.handleInputChange}
            handleSubmitMessage={this.handleSubmitMessage}
            socket={this.socket}
            deleteChannel={this.deleteChannel}
          />
        </div>
      </div>
    );
  }
}
export default Homepage;
