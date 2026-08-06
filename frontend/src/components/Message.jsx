// Message.jsx
function Message({ message, currentUser }) {

    const mine = message.sender === currentUser;

    return (

        <div
            className={
                mine
                ? "message mine"
                : "message other"
            }
        >

            <div className="message-text">

                {!mine &&
                    <strong>
                        {message.sender}
                    </strong>
                }

                <p>{message.text}</p>

                <span className="time">
                    {message.time}
                </span>

            </div>

        </div>

    );

}

export default Message;