import { Component } from "react";
import { Dropdown, Header, Menu } from "semantic-ui-react";

import "./sidebar.css";
import InviteModal from "../Invites/InviteModal";
import CreateChannelModal from "./CreateChannelModal";
import SignOut from "../Account/SignOut";

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <div className="AccountInfo">
          <Header as="h2"> {this.props.displayName} </Header>
          <SignOut />
        </div>
        <div className="ChannelTitleContainer">
          {(this.props.serverList.length > 0 && (
            <>
              <Dropdown
                fluid
                className="largeDropdown"
                placeholder="Select a server"
                onChange={this.props.onServerSelect}
                options={this.props.serverList}
                value={this.props.activeServerId}
              />
              <InviteModal serverId={this.props.activeServerId} />
            </>
          )) || <Header as="h2">You are not in any servers</Header>}
        </div>
        {this.props.serverList.length > 0 && (
          <div className="ChatList">
            <h4 className="textChannelHeader">Text Channels</h4>

            <Menu secondary vertical className="Menu">
              {this.props.channelList.map((channel) => {
                return (
                  <Menu.Item
                    key={channel.id}
                    className="channelContainer"
                    name={channel.name}
                    active={this.props.activeItem === channel.id}
                    onClick={(e) => {
                      this.props.onChannelSelect(e, channel.id, channel.name);
                    }}
                  >
                    <h3>{channel.name}</h3>
                  </Menu.Item>
                );
              })}
              <CreateChannelModal
                serverId={this.props.activeServerId}
                updateChannels={this.props.updateChannels}
              />
            </Menu>
          </div>
        )}
      </div>
    );
  }
}
export default Sidebar;
