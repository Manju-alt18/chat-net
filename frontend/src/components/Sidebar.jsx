import React from "react";

function Sidebar({ users = [], selectUser, selectedUser }) {

    return (
        <div className="sidebar">

            <h2>Users</h2>

            <div className="user-list">

                {users.length === 0 ? (

                    <p className="no-users">
                        No users available
                    </p>

                ) : (

                    users.map((user, index) => {

                        const username =
                            typeof user === "string"
                                ? user
                                : user.username;

                        return (
                            <div
                                key={index}
                                className={
                                    selectedUser === username
                                        ? "user active"
                                        : "user"
                                }
                                onClick={() =>
                                    selectUser(username)
                                }
                            >

                                <div className="user-avatar">
                                    {username
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>

                                <div className="user-info">

                                    <span className="username">
                                        {username}
                                    </span>

                                    <span className="status">
                                        Online
                                    </span>

                                </div>

                            </div>
                        );
                    })

                )}

            </div>

        </div>
    );
}

export default Sidebar;