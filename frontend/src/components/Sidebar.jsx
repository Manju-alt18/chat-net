import { useEffect, useState } from "react";
import socket from "../services/socket";

function Sidebar({
    username,
    selectedUser,
    onSelectUser
}) {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    const [showAddUser, setShowAddUser] =
        useState(false);

    const [newUser, setNewUser] =
        useState("");

    useEffect(() => {

        const removeListener =
            socket.addMessageListener((data) => {

                console.log("Sidebar:", data);

                if (
    data.startsWith("MESSAGE:")
) {
    return;
}

                if (data === "END") {
                    return;
                }

                if (data === "LOGIN_SUCCESS") {
                    return;
                }

                if (data === "USER_OFFLINE") {
                    return;
                }

                /*
                 * Java sends online usernames:
                 *
                 * Alice
                 * Bob
                 * END
                 */

                if (
                    data &&
                    !data.includes(":")
                ) {

                    const user =
                        data.trim();

                    if (
                        user &&
                        user !== username
                    ) {

                        setUsers((oldUsers) => {

                            if (
                                oldUsers.includes(user)
                            ) {
                                return oldUsers;
                            }

                            return [
                                ...oldUsers,
                                user
                            ];
                        });
                    }
                }

            });

        const requestUsers =
            setTimeout(() => {

                socket.getOnlineUsers();

            }, 500);

        return () => {

            clearTimeout(requestUsers);

            removeListener();
        };

    }, [username]);


    // =========================
    // ADD USER
    // =========================

    const addUser = () => {

        const name =
            newUser.trim();

        if (!name) {
            return;
        }

        if (
            name.toLowerCase() ===
            username.toLowerCase()
        ) {

            alert(
                "You cannot add yourself."
            );

            return;
        }

        const alreadyExists =
            users.some(
                (user) =>
                    user.toLowerCase() ===
                    name.toLowerCase()
            );

        if (alreadyExists) {

            onSelectUser(name);

            setNewUser("");

            setShowAddUser(false);

            return;
        }

        setUsers((oldUsers) => [
            ...oldUsers,
            name
        ]);

        onSelectUser(name);

        setNewUser("");

        setShowAddUser(false);
    };


    const filteredUsers =
        users.filter((user) =>
            user
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );


    return (

        <aside className="sidebar">

            {/* HEADER */}

            <div className="sidebar-header">

                <div className="profile">

                    <div className="avatar">
                        {username
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </div>

                    <div>

                        <h3>
                            {username}
                        </h3>

                        <span>
                            Online
                        </span>

                    </div>

                </div>


                <div className="sidebar-actions">

                    <button
                        className="add-user-button"
                        onClick={() =>
                            setShowAddUser(true)
                        }
                        title="Add user"
                    >
                        +
                    </button>

                    <div className="header-icon">
                        ⋮
                    </div>

                </div>

            </div>


            {/* SEARCH */}

            <div className="search-box">

                <span>⌕</span>

                <input
                    type="text"
                    placeholder="Search chats"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {/* USER LIST */}

            <div className="chat-list">

                {filteredUsers.length === 0 ? (

                    <div className="no-users">

                        <div>
                            👥
                        </div>

                        <p>
                            No chats yet
                        </p>

                        <small>
                            Click + to add a user
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
                                    ?.charAt(0)
                                    ?.toUpperCase()}

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


            {/* ADD USER POPUP */}

            {showAddUser && (

                <div
                    className="add-user-overlay"
                    onClick={() =>
                        setShowAddUser(false)
                    }
                >

                    <div
                        className="add-user-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <h3>
                                Add New Chat
                            </h3>

                            <button
                                onClick={() =>
                                    setShowAddUser(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <p>
                            Enter the username
                            you want to chat with.
                        </p>


                        <input
                            type="text"
                            placeholder="Username"
                            value={newUser}
                            autoFocus
                            onChange={(e) =>
                                setNewUser(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {

                                if (
                                    e.key === "Enter"
                                ) {
                                    addUser();
                                }

                            }}
                        />


                        <div className="modal-buttons">

                            <button
                                className="cancel-button"
                                onClick={() =>
                                    setShowAddUser(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="add-button"
                                onClick={addUser}
                            >
                                Add User
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </aside>
    );
}

export default Sidebar;