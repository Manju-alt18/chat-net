import { useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

function App() {

    const [username, setUsername] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

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