import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Message from "./Message";
import GroupChat from "./GroupChat";
import socket from "../services/socket";

function Chat({ username }) {

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [selectedChat, setSelectedChat] = useState("");
    const [chatType, setChatType] = useState("private");

    const users = ["Alice", "Bob", "Charlie"];
    const groups = ["Java Group", "Project Team"];

    useEffect(() => {

        socket.connect();

        socket.receive((data) => {

            console.log("Received from server:", data);

            if (data.type === "MESSAGE") {

                setMessages((old) => [
                    ...old,
                    {
                        sender: data.sender || "Server",
                        text: data.text || data.data,
                        time: data.time ||
                            new Date().toLocaleTimeString()
                    }
                ]);

            }

        });

    }, []);

    const selectChat = (name, type) => {

        setSelectedChat(name);
        setChatType(type);
        setMessages([]);

    };

    const sendMessage = () => {

        if (!text.trim()) {
            return;
        }

        if (!selectedChat) {
            alert("Please select a user or group first.");
            return;
        }

        const message = {

            type: chatType === "private"
                ? "PRIVATE_MESSAGE"
                : "GROUP_MESSAGE",

            sender: username,

            receiver:
                chatType === "private"
                    ? selectedChat
                    : undefined,

            groupName:
                chatType === "group"
                    ? selectedChat
                    : undefined,

            text: text,

            time: new Date().toLocaleTimeString()

        };

        console.log("Sending:", message);

        // Show message immediately in the chat window
        setMessages((old) => [
            ...old,
            message
        ]);

        // Send to backend
        socket.send(message);

        setText("");

    };

    if (chatType === "group" && selectedChat) {

        return (

            <div className="chat-container">

                <Sidebar
                    users={users}
                    groups={groups}
                    selectChat={selectChat}
                />

                <GroupChat
                    username={username}
                    groupName={selectedChat}
                />

            </div>

        );

    }

    return (

        <div className="chat-container">

            <Sidebar
                users={users}
                groups={groups}
                selectChat={selectChat}
            />

            <div className="chat-window">

                <div className="chat-header">

                    <h2>
                        {selectedChat || "Select a Chat"}
                    </h2>

                    <span>
                        {selectedChat
                            ? "Private Chat"
                            : ""}
                    </span>

                </div>

                <div className="messages">

                    {messages.length === 0 ? (

                        <div
                            style={{
                                textAlign: "center",
                                color: "#aaa",
                                marginTop: "30px"
                            }}
                        >
                            No messages yet
                        </div>

                    ) : (

                        messages.map((msg, index) => (

                            <Message
                                key={index}
                                message={msg}
                                currentUser={username}
                            />

                        ))

                    )}

                </div>

                <div className="message-box">

                    <input
                        type="text"
                        placeholder={
                            selectedChat
                                ? "Type a message..."
                                : "Select a chat first..."
                        }
                        value={text}
                        disabled={!selectedChat}
                        onChange={(e) =>
                            setText(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                sendMessage();
                            }

                        }}
                    />

                    <button
                        onClick={sendMessage}
                        disabled={!selectedChat}
                    >
                        Send
                    </button>

                </div>

            </div>

        </div>

    );
}

export default Chat;