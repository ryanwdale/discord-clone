import { Component, useReducer } from 'react';
import { Header, Menu } from 'semantic-ui-react';

import "./sidebar.css"
import InviteModal from "../Invites/InviteModal"
import CreateChannelModal from './CreateChannelModal';
import SignOut from "../Account/SignOut";

class Sidebar extends Component{

    render() {
        return (
            <div className="sidebar">
                <div className="AccountInfo">
                    <h2 className="username"> Username </h2>
                    <SignOut />
                </div>
                <div className="ChannelTitleContainer">
                    <Header as="h2">Server 1</Header>
                    <InviteModal serverId={1} />
                </div>
                <div className="ChatList">
                    <h4 className="textChannelHeader">Text Channels</h4>
                    
                    <Menu secondary vertical className="Menu">
                        {this.props.channelList.map(channel => {
                            return (
                                <Menu.Item
                                key={channel.id}
                                className="channelContainer"
                                name={channel.name}
                                active={this.props.activeItem === channel.id}
                                onClick={(e) => {this.props.onChannelSelect(e, channel.id, channel.name)}}
                                >
                                    <h3>{channel.name}</h3>
                                </Menu.Item>
                            )
                        })}
                        <CreateChannelModal 
                            serverId={1}
                            updateChannels={this.props.updateChannels}
                        />
                    </Menu>
                </div>
            </div>
        )
    }
}
export default Sidebar;
