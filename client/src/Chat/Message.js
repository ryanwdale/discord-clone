import { Component } from 'react';
import { Header } from 'semantic-ui-react';
import './message.css'

class Message extends Component{
    render () {
        return (
            <div className="messageContainer">
                <div className="messageHeader">
                    <Header as="h4">
                        {this.props.displayName}
                        <span className="messageTimeStamp">{this.props.timestamp}</span>
                    </Header>
                </div>
                <p>{this.props.messageContent}</p>
            </div>
        )
    }
}
export default Message;