import { Component } from 'react';
import axios from 'axios';

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

    componentDidMount() {
        this.fetchChannelData()
    }

    fetchChannelData = () => {
        axios.get(
            `/api/channels/${this.state.activeChannelId}/messages`,
        )
        .then(res => {
            this.setState({
                activeMessage: "",
                activeChat: res.data
            },
            () => {
                // We also want to scroll to the latest message, we want to do this after we set state so the div is on the right height
                // from https://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
                let chatMessages = document.getElementById("chatMessages");
                chatMessages.scrollTop = chatMessages.scrollHeight;
            })
        })
        .catch(e => alert(e.response.data.message))
    }

    onChannelSelect = (e, id, name) => {
        // We want to fetch the latest messages for the selected channels as well
        if (id !== this.state.activeChannelId) {
            this.setState({activeChannelId: id, activeChannelName: name},
                () => {
                    this.fetchChannelData()
                })
        }
    }

    handleInputChange = (value) => this.setState({ activeMessage: value })

    handleSubmitMessage = (e) => {
        e.preventDefault()

        // Should talk to Socket and DB to update messageList instead of directly
        // updating messageList
        if (this.state.activeMessage.length){
            // Send the message to the DB
            // We need another step of sending this to the socket and broadcasting this
            const formData = new FormData()
            formData.append("message_content", this.state.activeMessage)

            axios.post(
                `/api/channels/${this.state.activeChannelId}/messages`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            .then(()=> {
                this.fetchChannelData(this.state.activeChannelId)
            })
            .catch(e => alert(e.response.data.message))
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
