import { Component } from 'react';
import { Header } from 'semantic-ui-react';
import './message.css'

class Message extends Component{
    render () {
        return (
            <div className="messageContainer">
                <div className="messageHeader">
                    <Header as="h4">
                        User1
                        <span className="messageTimeStamp">timestamp 10:00</span>
                    </Header>
                </div>
                <p>This is a message</p>
            </div>
        )
    }
}
export default Message;