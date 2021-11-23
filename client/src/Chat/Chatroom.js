import { Component } from 'react';
import { Header } from 'semantic-ui-react';
import './chatroom.css'
import Message  from './Message';

class Chatroom extends Component{
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="chatroom">
                <div className="channelNameContainer">
                    <Header as="h2">{this.props.channelName}</Header>
                </div>
                <div className="chatMessages">
                    <Message/>
                    <Message/>
                    <Message/>
                    <Message/>
                    <Message/>
                </div>
                <div className="chatInput">
                    <form>
                        <input placeholder={"Send message to " + this.props.channelName}></input>
                        <button type="submite" className="chatInputSubmit">
                            send message
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}
export default Chatroom;