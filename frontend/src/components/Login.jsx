import { useState } from "react";

function Login({ onLogin }) {

    const [username, setUsername] = useState("");

    const handleLogin = (e) => {

        e.preventDefault();

        const name = username.trim();

        if (!name) {
            return;
        }

        onLogin(name);
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    💬
                </div>

                <h1>ChatApp</h1>

                <p>
                    Connect and chat with your friends
                </p>

                <form onSubmit={handleLogin}>

                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        autoFocus
                    />

                    <button type="submit">
                        Start Chat
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;