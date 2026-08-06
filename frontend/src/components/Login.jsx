// Login.jsx
import { useState } from "react";

function Login({ setUser }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {

        if (username.trim() === "" || password.trim() === "") {
            alert("Enter Username and Password");
            return;
        }

        // Later connect with Java Backend
        setUser(username);

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Chat App</h1>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <button onClick={login}>
                    Login
                </button>

            </div>

        </div>

    );

}

export default Login;