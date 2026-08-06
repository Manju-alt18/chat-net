import { useState, useEffect } from "react";
import Message from "./Message";
import socket from "../services/socket";

function GroupChat({ username, groupName }) {

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {

        socket.receive((data) => {

            if (
                data.type === "GROUP_MESSAGE" &&
                data.groupName === groupName
            ) {

                setMessages((old) => [...old, data]);

            }

        });

    }, [groupName]);

    const sendMessage = () => {

        if (text.trim() === "") return;

        const message = {

            type: "GROUP_MESSAGE",
            sender: username,
            groupName: groupName,
            text: text,
            time: new Date().toLocaleTimeString()

        };

        socket.send(message);

        setMessages((old) => [...old, message]);

        setText("");

    };

    return (

        <div className="chat-window">

            <div className="chat-header">

                <h2>👥 {groupName}</h2>

                <span>Group Chat</span>

            </div>

            <div className="messages">

                {messages.map((msg, index) => (

                    <Message
                        key={index}
                        message={{
                            sender: msg.sender,
                            text: msg.text,
                            time: msg.time
                        }}
                        currentUser={username}
                    />

                ))}

            </div>

            <div className="message-box">

                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <button onClick={sendMessage}>
                    Send
                </button>

            </div>

        </div>

    );

}

export default GroupChat;
