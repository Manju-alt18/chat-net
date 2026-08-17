import { useEffect, useRef, useState } from "react";
import socket from "../services/socket";

function ChatWindow({
    username,
    selectedUser
}) {

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const messagesEndRef = useRef(null);

    // =========================
    // Receive messages
    // =========================

    useEffect(() => {

        const removeListener =
    socket.addMessageListener((data) => {

            console.log(
                "Message received:",
                data
            );

            if (
    data &&
    data.includes(":") &&
    data !== "USER_OFFLINE"
) {

    const separator =
        data.indexOf(":");

    const sender =
        data.substring(0, separator).trim();

    const message =
        data.substring(separator + 1).trim();
                const newMessage = {

                    id:
                        Date.now() +
                        Math.random(),

                    sender: sender,

                    text: message,

                    time:
                        new Date()
                            .toLocaleTimeString(
                                [],
                                {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }
                            )
                };

                setMessages((oldMessages) => [

                    ...oldMessages,

                    newMessage

                ]);

                // Browser notification
                if (
                    sender !== username &&
                    document.hidden
                ) {

                    showNotification(
                        sender,
                        message
                    );
                }
            }

        });

    }, [username]);


    // =========================
    // Auto scroll
    // =========================

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);


    // =========================
    // Notification
    // =========================

    const showNotification = (
        sender,
        message
    ) => {

        if (
            "Notification" in window &&
            Notification.permission === "granted"
        ) {

            new Notification(
                sender,
                {
                    body: message
                }
            );
        }
    };


    // =========================
    // Send message
    // =========================

    const sendMessage = () => {

        if (!selectedUser) {
            return;
        }

        const message = text.trim();

        if (!message) {
            return;
        }

        const sent = socket.sendMessage(
            selectedUser,
            message
        );

        if (!sent) {

            alert(
                "Not connected to chat server."
            );

            return;
        }

        // Show own message immediately
        setMessages((oldMessages) => [

            ...oldMessages,

            {
                id:
                    Date.now() +
                    Math.random(),

                sender: username,

                text: message,

                time:
                    new Date()
                        .toLocaleTimeString(
                            [],
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        )
            }

        ]);

        setText("");
    };


    // =========================
    // Enter key
    // =========================

    const handleKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();
        }
    };


    // =========================
    // Notification permission
    // =========================

    useEffect(() => {

        if (
            "Notification" in window &&
            Notification.permission === "default"
        ) {

            Notification.requestPermission();
        }

    }, []);


    // =========================
    // No chat selected
    // =========================

    if (!selectedUser) {

        return (

            <main className="chat-window empty-window">

                <div className="welcome">

                    <div className="welcome-icon">
                        💬
                    </div>

                    <h1>
                        ChatApp
                    </h1>

                    <p>
                        Select a person from the
                        left to start chatting.
                    </p>

                </div>

            </main>
        );
    }


    // =========================
    // Current conversation
    // =========================

    const conversation =
        messages.filter(
            (message) =>

                (
                    message.sender ===
                    username
                ) ||

                (
                    message.sender ===
                    selectedUser
                )
        );


    return (

        <main className="chat-window">

            {/* Header */}

            <header className="chat-header">

                <div className="chat-profile">

                    <div className="header-avatar">

                        {selectedUser
                            .charAt(0)
                            .toUpperCase()}

                        <span className="online-dot" />

                    </div>

                    <div>

                        <h3>
                            {selectedUser}
                        </h3>

                        <span>
                            online
                        </span>

                    </div>

                </div>

                <div className="chat-actions">

                    <button title="Search">
                        ⌕
                    </button>

                    <button title="More">
                        ⋮
                    </button>

                </div>

            </header>


            {/* Messages */}

            <section className="messages">

                <div className="date-divider">
                    <span>
                        TODAY
                    </span>
                </div>

                {conversation.map(
                    (message) => {

                        const mine =
                            message.sender ===
                            username;

                        return (

                            <div
                                key={message.id}
                                className={
                                    mine
                                        ? "message-row mine"
                                        : "message-row"
                                }
                            >

                                <div className="message-bubble">

                                    <div className="message-text">
                                        {message.text}
                                    </div>

                                    <div className="message-time">

                                        {message.time}

                                        {mine && (
                                            <span className="ticks">
                                                ✓✓
                                            </span>
                                        )}

                                    </div>

                                </div>

                            </div>
                        );
                    }
                )}

                <div
                    ref={messagesEndRef}
                />

            </section>


            {/* Input */}

            <footer className="message-input-area">

                <button
                    className="input-icon"
                    title="Emoji"
                >
                    ☺
                </button>

                <input
                    type="text"
                    placeholder={
                        `Message ${selectedUser}`
                    }
                    value={text}
                    onChange={(e) =>
                        setText(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                />

                <button
                    className="send-button"
                    onClick={sendMessage}
                    disabled={!text.trim()}
                >
                    ➤
                </button>

            </footer>

        </main>
    );
}

export default ChatWindow;