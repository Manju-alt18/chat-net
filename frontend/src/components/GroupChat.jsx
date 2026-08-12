// NOT CONNECTED TO THE BACKEND.
// Your server doesn't support group chat yet, so this is a UI shell
// only — no socket calls happen here. Once the server defines a group
// protocol (e.g. "GROUP_MSG:groupId:text" / "GROUP_MESSAGE:group:sender:text"),
// wire this up the same way Chat.jsx is wired to private messages.

function GroupChat() {

    return (

        <div className="chat-container">

            <div className="chat-window">

                <div className="chat-header">
                    <h2>Group Chat</h2>
                </div>

                <div className="messages">
                    <div className="empty-chat">
                        Group chat isn't available yet — the server doesn't
                        support it. This screen is a placeholder.
                    </div>
                </div>

                <div className="message-box">
                    <input
                        type="text"
                        placeholder="Group chat coming soon..."
                        disabled
                    />
                    <button disabled>Send</button>
                </div>

            </div>

        </div>

    );
}

export default GroupChat;