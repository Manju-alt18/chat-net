import { useEffect, useState } from "react";
import socket from "../services/socket";

function Sidebar({
    username,
    selectedUser,
    onSelectUser
}) {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        const handleServerMessage = (data) => {

            if (data.startsWith("USER:")) {

                const user = data.substring(5);

                if (user && user !== username) {

                    setUsers((oldUsers) => {

                        if (oldUsers.includes(user)) {
                            return oldUsers;
                        }

                        return [...oldUsers, user];
                    });
                }
            }

            if (data === "END") {
                return;
            }
        };

        const removeListener =
    socket.addMessageListener((data) => {
            socket.getOnlineUsers();
        }, 500);

        return () => clearTimeout(timer);

    }, [username]);

    const filteredUsers = users.filter((user) =>
        user.toLowerCase().includes(
            search.toLowerCase()
        )
    );

    return (
        <aside className="sidebar">

            {/* Header */}

            <div className="sidebar-header">

                <div className="profile">

                    <div className="avatar">
                        {username
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <h3>{username}</h3>
                        <span>Online</span>
                    </div>

                </div>

                <div className="header-icon">
                    ⋮
                </div>

            </div>


            {/* Search */}

            <div className="search-box">

                <span>⌕</span>

                <input
                    type="text"
                    placeholder="Search or start new chat"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {/* Chat List */}

            <div className="chat-list">

                {filteredUsers.length === 0 ? (

                    <div className="no-users">

                        <div>👥</div>

                        <p>
                            No other users online
                        </p>

                        <small>
                            Ask another user to login
                        </small>

                    </div>

                ) : (

                    filteredUsers.map((user) => (

                        <div
                            key={user}
                            className={
                                selectedUser === user
                                    ? "chat-item active"
                                    : "chat-item"
                            }
                            onClick={() =>
                                onSelectUser(user)
                            }
                        >

                            <div className="chat-avatar">

                                {user
                                    .charAt(0)
                                    .toUpperCase()}

                                <span className="online-dot" />

                            </div>

                            <div className="chat-info">

                                <div className="chat-top">

                                    <strong>
                                        {user}
                                    </strong>

                                </div>

                                <div className="last-message">
                                    Online
                                </div>

                            </div>

                        </div>

                    ))
                )}

            </div>

        </aside>
    );
}

export default Sidebar;