import { Component } from 'react';
import Chatroom from './Chatroom';
import Sidebar from './Sidebar'
import './homepage.css'

const channelList = [
    {
        id: 1,
        name: "Channel 1"
    }, {
        id: 2,
        name: "Channel 2"
    }, {
        id: 3,
        name: "Channel 3"
    }
];

class Homepage extends Component{
    constructor() {
        super()
        this.state = {channelList: channelList, activeChannelId: null, activeChannelName: null}
    }

    onChannelSelect = (e, id, name) => {
        this.setState({activeChannelId: id, activeChannelName: name})
    }

    render() {
        return (
            <div className="homeContainer">
                <div className="sidebarContainer">
                    <Sidebar 
                        className="sidebar" 
                        channelList={this.state.channelList} 
                        onChannelSelect={this.onChannelSelect} 
                        activeItem={this.state.activeChannelId}/>
                </div>
                <div className="chatroomContainer">
                    <Chatroom className="chatroom" channelName={this.state.activeChannelName}/>
                </div>
            </div>
        )
    }
}
export default Homepage;