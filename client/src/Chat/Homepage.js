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
        this.state = {channelList: channelList, activeItem: null}
    }

    onChannelSelect = (e, name) => {
        console.log(name)
        this.setState({activeItem: name})
    }

    render() {
        return (
            <div className="homeContainer">
                <div className="sidebarContainer">
                    <Sidebar 
                        className="sidebar" 
                        channelList={this.state.channelList} 
                        onChannelSelect={this.onChannelSelect} 
                        activeItem={this.state.activeItem}/>
                </div>
                <div className="chatroomContainer">
                    <Chatroom className="chatroom" channelName={this.state.activeItem}/>
                </div>
            </div>
        )
    }
}
export default Homepage;