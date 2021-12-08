import { Component } from "react";
import axios from "axios";

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
      channelList: [],
      activeChannelId: null,
      activeChannelName: null,
      serverList: [],
      activeServerId: null,
      activeMessage: "",
      activeSearchMessage: "",
      activeChat: [],
      accountId: null,
      showAnalytics: false,
      analytics: null
    };
    this.socket = io();
    this.socket.on("client message", (message) => {
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
        .catch((e) => alert(e.response.data.message));
    }
  };

  onChannelSelect = (e, id, name) => {
    // We want to fetch the latest messages for the selected channels as well
    if (id !== this.state.activeChannelId) {
      this.socket.emit("leave", { channel_id: this.state.activeChannelId });
      this.setState({ activeChannelId: id, activeChannelName: name, showAnalytics: false}, () => {
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
                      this.setState(
                        {
                          activeChannelId: activeChannel.id,
                          activeChannelName: activeChannel.name,
                        },
                        () => {
                          this.socket.emit("join", {
                            channel_id: activeChannel.id,
                          });
                          this.fetchChannelData();
                        }
                      );
                    }
                  }
                }
              );
            }
          }
        );
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

  fetchChannelAnalytics = () => {
    axios
      .get(
        `/api/channels/${this.state.activeChannelId}/analytics`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        this.setState({showAnalytics: true, analytics: res.data})
      })
      .catch((e) => alert(e.response.data.message));
  }

  toggleShowAnalytics = () => {
    this.setState({showAnalytics: false}, scrollToTop)
  }

  handleInputChange = (value) => this.setState({ activeMessage: value });
  handleSearchChange = (value) => this.setState({ activeSearchMessage: value });
  onServerSelect = (e, data) => {
    this.setState({ activeServerId: data.value, showAnalytics: false }, () => {
      this.updateChannels();
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
        .then((res) => {
          let message = res.data;
          // We need to fill in the display name
          message.display_name = this.state.displayName;

          this.socket.emit("server message", {
            message: message,
            room: this.state.activeChannelId,
          });

          this.setState({ activeMessage: "" });
        })
        .catch((e) => alert(e.response.data.message));
    }
  };

  handleSubmitSearchMessage = (e) => {
    e.preventDefault();

    // TODO: add backend logic
    console.log(this.state.activeSearchMessage);
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
            channelId={this.state.activeChannelId}
            channelName={this.state.activeChannelName}
            activeUserId={this.state.accountId}
            activeMessage={this.state.activeMessage}
            activeSearchMessage={this.state.activeSearchMessage}
            messageList={this.state.activeChat}
            fetchChannelAnalytics={this.fetchChannelAnalytics}
            showAnalytics={this.state.showAnalytics}
            toggleShowAnalytics={this.toggleShowAnalytics}
            analytics={this.state.analytics}
            handleChange={this.handleInputChange}
            handleSearchChange={this.handleSearchChange}
            handleSubmitMessage={this.handleSubmitMessage}
            handleSubmitSearchMessage={this.handleSubmitSearchMessage}
            socket={this.socket}
          />
        </div>
      </div>
    );
  }
}
export default Homepage;
