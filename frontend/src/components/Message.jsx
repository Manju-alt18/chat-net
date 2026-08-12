function Message({ message, currentUser }) {

    const isOwnMessage = message.sender === currentUser;

    return (

        <div className={"message " + (isOwnMessage ? "own" : "other")}>

            {!isOwnMessage && (
                <div className="message-sender">{message.sender}</div>
            )}

            <div className="message-text">{message.text}</div>

            <div className="message-time">{message.time}</div>

        </div>

    );
}

export default Message;