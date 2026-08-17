import { useEffect, useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import socket from "./services/socket";

function App() {

    const [username, setUsername] = useState("");
    const [selectedUser, setSelectedUser] =
        useState(null);

    useEffect(() => {

        if (!username) {
            return;
        }

        console.log(
            "Connecting user:",
            username
        );

        socket.connect(username);

        return () => {
            // Don't disconnect here during development
            // because React StrictMode can run effects twice.
        };

    }, [username]);


    if (!username) {

        return (
            <Login
                onLogin={(name) => {
                    setUsername(name);
                }}
            />
        );
    }


    return (
        <div className="app">

            <Sidebar
                username={username}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
            />

            <ChatWindow
                username={username}
                selectedUser={selectedUser}
            />

        </div>
    );
}

export default App;