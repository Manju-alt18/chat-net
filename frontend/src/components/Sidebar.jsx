import { useEffect, useState } from "react";
import socket from "../services/socket";

// ASSUMPTION — server broadcasts something like "USERLIST:alice,bob,carol".
// Confirm the exact format and adjust the parsing below to match.
function Sidebar({ selectUser, selectedUser }) {

    const [users, setUsers] = useState([]);

    useEffect(() => {

        const unsubscribe = socket.receive((data) => {

            if (typeof data === "string" && data.startsWith("USERLIST:")) {

                const list = data
                    .slice("USERLIST:".length)
                    .split(",")
                    .map((u) => u.trim())
                    .filter(Boolean);

                setUsers(list);

            }

        });

        return () => unsubscribe();

    }, []);

    return (

        <div className="sidebar">

            <h3>Users</h3>

            {users.length === 0 && (
                <div className="sidebar-empty">No users online.</div>
            )}

            <ul className="user-list">
                {users.map((user) => (
                    <li
                        key={user}
                        className={user === selectedUser ? "active" : ""}
                        onClick={() => selectUser(user)}
                    >
                        {user}
                    </li>
                ))}
            </ul>

        </div>

    );
}

export default Sidebar;