// Sidebar.jsx
import { useState } from "react";

function Sidebar({ users, groups, selectChat }) {

    const [search, setSearch] = useState("");

    return (

        <div className="sidebar">

            <h2>Chat App</h2>

            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <h3>Online Users</h3>

            <div className="list">

                {users
                    .filter(user =>
                        user.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((user, index) => (

                        <div
                            key={index}
                            className="list-item"
                            onClick={() => selectChat(user, "private")}
                        >
                            🟢 {user}
                        </div>

                    ))}

            </div>

            <h3>Groups</h3>

            <div className="list">

                {groups.map((group, index) => (

                    <div
                        key={index}
                        className="list-item"
                        onClick={() => selectChat(group, "group")}
                    >
                        👥 {group}
                    </div>

                ))}

            </div>

        </div>

    );

}

export default Sidebar;