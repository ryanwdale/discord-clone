import { Component } from 'react';
import './message.css'

class Message extends Component{
    render () {
        return (
            <div className="messageContainer">
                <div className="messageHeader">
                    <h4>
                        User1
                        <span className="messageTimeStamp">timestamp 10:00</span>
                    </h4>
                </div>
                <p>This is a message</p>
            </div>
        )
    }
}
export default Message;