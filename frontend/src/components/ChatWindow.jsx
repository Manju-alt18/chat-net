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
                "ChatWindow received:",
                data
            );

            if (!data) {
                return;
            }

            // Ignore non-message responses
            if (
                data === "LOGIN_SUCCESS" ||
                data === "USER_OFFLINE" ||
                data === "END"
            ) {
                return;
            }

            /*
             * Expected:
             *
             * MESSAGE:alice:hiiii:22:04:56
             */

            if (!data.startsWith("MESSAGE:")) {
                return;
            }

            const content =
                data.substring(8);

            /*
             * Find first :
             * separates sender from message
             */

            const firstColon =
                content.indexOf(":");

            if (firstColon === -1) {
                return;
            }

            const sender =
                content
                    .substring(0, firstColon)
                    .trim();

            /*
             * Everything after sender
             */

            let remaining =
                content.substring(
                    firstColon + 1
                );

            /*
             * Timestamp is at the END:
             *
             * 22:04:56
             */

            let time =
                new Date().toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

            const timeMatch =
                remaining.match(
                    /(\d{2}:\d{2}:\d{2})$/
                );

            if (timeMatch) {

                time = timeMatch[1];

                remaining =
                    remaining
                        .substring(
                            0,
                            timeMatch.index
                        )
                        .replace(/:$/, "");
            }

            const message =
                remaining.trim();

            if (!sender || !message) {
                return;
            }


            const newMessage = {

                id:
                    Date.now() +
                    Math.random(),

                sender: sender,

                text: message,

                time: time
            };


            setMessages(
                (oldMessages) => [
                    ...oldMessages,
                    newMessage
                ]
            );

        });


    return () => {

        removeListener();

    };

}, []);


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