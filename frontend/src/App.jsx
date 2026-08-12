import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";
import "./App.css";

function App() {

    // "login" | "register" | "chat"
    const [view, setView] = useState("login");
    const [username, setUsername] = useState("");

    const handleLoginSuccess = (loggedInUsername) => {
        setUsername(loggedInUsername);
        setView("chat");
    };

    const handleRegisterSuccess = () => {
        // Send the user to log in with their new account.
        setView("login");
    };

    if (view === "login") {
        return (
            <Login
                onLoginSuccess={handleLoginSuccess}
                onGoToRegister={() => setView("register")}
            />
        );
    }

    if (view === "register") {
        return (
            <Register
                onRegisterSuccess={handleRegisterSuccess}
                onGoToLogin={() => setView("login")}
            />
        );
    }

    return <Chat username={username} />;
}

export default App;