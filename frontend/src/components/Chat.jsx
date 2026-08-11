import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Message from "./Message";
import socket from "../services/socket";

function Chat({ username }) {

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [selectedUser, setSelectedUser] = useState("");

    useEffect(() => {

        if (!username) {
            console.log("No username available");
            return;
        }

        console.log("Connecting as:", username);

        socket.connect(username);

        socket.receive((data) => {

            console.log("================================");
            console.log("MESSAGE FROM SERVER:", data);
            console.log("================================");

            // Login response
            if (data === "LOGIN_SUCCESS") {

                console.log(
                    "Logged in successfully as",
                    username
                );

                return;
            }

            // Receiver is offline
            if (data === "USER_OFFLINE") {

                alert("This user is offline.");
                return;
            }

            // Message from another user
            if (data.startsWith("MESSAGE:")) {

                const parts = data.split(":");

                const sender = parts[1];

                const message =
                    parts.slice(2).join(":");

                console.log("Sender:", sender);
                console.log("Message:", message);

                setMessages((previousMessages) => [

                    ...previousMessages,

                    {
                        sender: sender,
                        text: message,
                        time: new Date().toLocaleTimeString()
                    }

                ]);

                return;
            }

            console.log(
                "Other server response:",
                data
            );

        });

        return () => {
            // Don't close the socket here if your
            // app switches between chat components.
        };

    }, [username]);


    const selectUser = (user) => {

        console.log("Selected user:", user);

        setSelectedUser(user);

        setMessages([]);

    };


    const sendMessage = () => {

        if (!selectedUser) {

            alert("Please select a user.");

            return;
        }

        if (!text.trim()) {
            return;
        }

        const messageText = text.trim();

        console.log(
            "Sending message to:",
            selectedUser
        );

        console.log(
            "Message:",
            messageText
        );

        // Send to Java server
        socket.send({

            type: "PRIVATE_MESSAGE",

            receiver: selectedUser,

            text: messageText

        });

        // Show own message immediately
        setMessages((previousMessages) => [

            ...previousMessages,

            {
                sender: username,
                text: messageText,
                time: new Date().toLocaleTimeString()
            }

        ]);

        setText("");

    };


    return (

        <div className="chat-container">

            <Sidebar
                selectUser={selectUser}
                selectedUser={selectedUser}
            />

            <div className="chat-window">

                {/* HEADER */}

                <div className="chat-header">

                    <div>

                        <h2>
                            {selectedUser ||
                                "Select a user"}
                        </h2>

                        {selectedUser && (
                            <span>
                                Private Chat
                            </span>
                        )}

                    </div>

                </div>


                {/* MESSAGES */}

                <div className="messages">

                    {!selectedUser && (

                        <div className="empty-chat">

                            Select a user to start
                            chatting.

                        </div>

                    )}


                    {selectedUser &&
                        messages.length === 0 && (

                            <div className="empty-chat">

                                No messages yet.

                            </div>

                        )}


                    {messages.map(
                        (message, index) => (

                            <Message
                                key={index}
                                message={message}
                                currentUser={username}
                            />

                        )
                    )}

                </div>


                {/* MESSAGE INPUT */}

                <div className="message-box">

                    <input
                        type="text"
                        value={text}
                        disabled={!selectedUser}
                        placeholder={
                            selectedUser
                                ? "Type a message..."
                                : "Select a user first"
                        }
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
                        disabled={!selectedUser}
                        onClick={sendMessage}
                    >
                        Send
                    </button>

                </div>

            </div>

        </div>

    );
}

export default Chat;