import { useEffect, useState } from "react";
import socket from "../services/socket";

function Login({ onLoginSuccess, onGoToRegister }) {

    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {

        const unsubscribe = socket.receive((data) => {

            if (data === "LOGIN_SUCCESS") {
                setConnecting(false);
                onLoginSuccess(username);
                return;
            }

            // ASSUMPTION — confirm the server actually sends this on
            // failed login (e.g. duplicate username). Adjust to match.
            if (typeof data === "string" && data.startsWith("LOGIN_FAIL")) {
                setConnecting(false);
                setError("Login failed. Try a different username.");
                return;
            }

        });

        return () => unsubscribe();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    const handleLogin = () => {

        const trimmed = username.trim();

        if (!trimmed) {
            setError("Please enter a username.");
            return;
        }

        setError("");
        setConnecting(true);
        socket.connect(trimmed);

    };

    return (

        <div className="auth-container">

            <div className="auth-box">

                <h2>Log In</h2>

                <input
                    type="text"
                    value={username}
                    placeholder="Username"
                    disabled={connecting}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleLogin();
                    }}
                />

                {error && <div className="auth-error">{error}</div>}

                <button disabled={connecting} onClick={handleLogin}>
                    {connecting ? "Connecting..." : "Log In"}
                </button>

                <div className="auth-switch">
                    Don't have an account?{" "}
                    <button className="link-button" onClick={onGoToRegister}>
                        Register
                    </button>
                </div>

            </div>

        </div>

    );
}

export default Login;