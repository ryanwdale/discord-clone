import { Component } from 'react';
import { Header, Menu } from 'semantic-ui-react';
import "./sidebar.css"

class Sidebar extends Component{
    constructor(props){
        super(props)
        this.state = {channelList: this.props.channelList}
    }
    render() {
        return (
            <div className="sidebar">
                <div className="ChannelTitleContainer">
                    <Header as="h2">Server 1</Header>
                </div>
                <div className="ChatList">
                    <h4 className="textChannelHeader">Text Channels</h4>
                    
                    <Menu secondary vertical className="Menu">
                        {this.state.channelList.map(channel => {
                            return (
                                <Menu.Item
                                key={channel.id}
                                className="channelContainer"
                                name={channel.name}
                                active={this.props.activeItem === channel.name}
                                onClick={(e) => {this.props.onChannelSelect(e, channel.name)}}
                                >
                                    <h3>{channel.name}</h3>
                                </Menu.Item>
                            )
                        })}
                    </Menu>
                </div>
            </div>
        )
    }
}
export default Sidebar;