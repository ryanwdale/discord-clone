import { Component } from 'react';
import { format } from 'date-fns'

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
        this.state = {
            channelList: channelList, 
            activeChannelId: channelList.length ? channelList[0].id : null, 
            activeChannelName: channelList.length ? channelList[0].name : null, 
            activeMessage: "", 
            activeChat: []
        }
    }

    onChannelSelect = (e, id, name) => {
        // We want to fetch the latest messages for the selected channels as well
        if (id !== this.state.activeChannelId) {
            // for now we just remove message list and start over
            this.setState({activeChat: []})
        }


        this.setState({activeChannelId: id, activeChannelName: name})
    }
    
    handleInputChange = (value) => this.setState({ activeMessage: value })

    handleSubmitMessage = (e) => {
        e.preventDefault()

        // Should talk to Socket and DB to update messageList instead of directly 
        // updating messageList
        if (this.state.activeMessage.length){
            this.setState((prevState) => ({
                activeMessage: "",
                activeChat: [...prevState.activeChat, {
                    displayName: "user1",
                    timestamp: format(new Date(), 'MM/dd/yyyy H:mm'),
                    messageContent: this.state.activeMessage
                }]
            }), 
            () => {
                // We also want to scroll to the latest message, we want to do this after we set state so the div is on the right height
                // from https://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
                let chatMessages = document.getElementById("chatMessages");
                chatMessages.scrollTop = chatMessages.scrollHeight;
            })
        }
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
        )
    }
}
export default Homepage;