// Chat.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import Message from "./Message";
import socket from "../services/socket";

function Chat({ username }) {

    const [messages, setMessages] = useState([]);

    const [text, setText] = useState("");

    const [selectedChat, setSelectedChat] = useState("");

    const [chatType, setChatType] = useState("private");

    const users = ["Alice", "Bob", "Charlie"];

    const groups = ["Java Group", "Project Team"];

    const selectChat = (name, type) => {

        setSelectedChat(name);

        setChatType(type);

        // Later load chat history
    };

    const sendMessage = () => {

        socket.send({

    type:chatType==="private"
        ?"PRIVATE_MESSAGE"
        :"GROUP_MESSAGE",

    sender:username,

    receiver:selectedChat,

    message:text

});

        setMessages([...messages, newMessage]);

        setText("");

        // Later send to Java Socket Server

    };

    return (

        <div className="chat-container">

            <Sidebar
                users={users}
                groups={groups}
                selectChat={selectChat}
            />

            <div className="chat-window">

                <div className="chat-header">

                    <h2>{selectedChat || "Select a Chat"}</h2>

                    <span>{chatType}</span>

                </div>

                <div className="messages">

                    {messages.map((msg, index) => (

                        <Message
                            key={index}
                            message={msg}
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

        </div>

    );

}

export default Chat;