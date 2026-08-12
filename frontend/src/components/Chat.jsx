import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Message from "./Message";
import socket from "../services/socket";

function Chat({ username }) {

    // Store messages PER conversation partner, not as one flat list.
    // Shape: { "alice": [ {sender, text, time}, ... ], "bob": [...] }
    const [conversations, setConversations] = useState({});
    const [text, setText] = useState("");
    const [selectedUser, setSelectedUser] = useState("");

    useEffect(() => {

        if (!username) {
            console.log("No username available");
            return;
        }

        console.log("Connecting as:", username);

        socket.connect(username);

        const unsubscribe = socket.receive((data) => {

            console.log("================================");
            console.log("MESSAGE FROM SERVER:", data);
            console.log("================================");

            // Login response
            if (data === "LOGIN_SUCCESS") {
                console.log("Logged in successfully as", username);
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
                const message = parts.slice(2).join(":");

                console.log("Sender:", sender);
                console.log("Message:", message);

                // File this message under the SENDER's conversation
                // thread (not the currently selected user), so it shows
                // up in the right place even if you're viewing someone
                // else's chat when it arrives.
                setConversations((previous) => {
                    const existing = previous[sender] || [];
                    return {
                        ...previous,
                        [sender]: [
                            ...existing,
                            {
                                sender: sender,
                                text: message,
                                time: new Date().toLocaleTimeString()
                            }
                        ]
                    };
                });

                return;
            }

            console.log("Other server response:", data);

        });

        return () => {
            // Stop listening when this component unmounts, but don't
            // close the shared socket connection itself — other
            // components (Sidebar, etc.) may still need it.
            unsubscribe();
        };

    }, [username]);


    const selectUser = (user) => {
        console.log("Selected user:", user);
        setSelectedUser(user);
        // No longer clearing messages here — each user keeps their own
        // history in `conversations`, so switching just changes which
        // slice we render.
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

        console.log("Sending message to:", selectedUser);
        console.log("Message:", messageText);

        // socket.js expects this object shape — it builds the
        // "MSG:receiver:text" wire string internally.
        socket.send({
            type: "PRIVATE_MESSAGE",
            receiver: selectedUser,
            text: messageText
        });

        // Show own message immediately, filed under the recipient's thread
        setConversations((previous) => {
            const existing = previous[selectedUser] || [];
            return {
                ...previous,
                [selectedUser]: [
                    ...existing,
                    {
                        sender: username,
                        text: messageText,
                        time: new Date().toLocaleTimeString()
                    }
                ]
            };
        });

        setText("");
    };


    const messages = conversations[selectedUser] || [];

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
                        <h2>{selectedUser || "Select a user"}</h2>
                        {selectedUser && <span>Private Chat</span>}
                    </div>
                </div>

                {/* MESSAGES */}
                <div className="messages">

                    {!selectedUser && (
                        <div className="empty-chat">
                            Select a user to start chatting.
                        </div>
                    )}

                    {selectedUser && messages.length === 0 && (
                        <div className="empty-chat">
                            No messages yet.
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <Message
                            key={index}
                            message={message}
                            currentUser={username}
                        />
                    ))}

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
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                    />

                    <button disabled={!selectedUser} onClick={sendMessage}>
                        Send
                    </button>

                </div>

            </div>

        </div>

    );
}

export default Chat;