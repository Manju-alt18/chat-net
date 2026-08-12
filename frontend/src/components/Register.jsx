import { useEffect, useState } from "react";
import socket from "../services/socket";

// NOTE: Registration protocol (REGISTER:/REGISTER_SUCCESS/REGISTER_FAIL)
// is an ASSUMPTION based on the LOGIN pattern in socket.js. Confirm the
// exact wire format against the Java server and adjust socket.js + here.
function Register({ onRegisterSuccess, onGoToLogin }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {

        // Registration needs its own connection to talk to the server
        // before a "real" login happens. Re-uses the same socket
        // instance/connection as login since ChatSocket is a singleton.
        socket.connect(username || "anonymous_registering_user");

        const unsubscribe = socket.receive((data) => {

            if (data === "REGISTER_SUCCESS") {
                setSubmitting(false);
                onRegisterSuccess();
                return;
            }

            if (typeof data === "string" && data.startsWith("REGISTER_FAIL")) {
                setSubmitting(false);
                const reason = data.split(":").slice(1).join(":");
                setError(reason || "Registration failed. Try a different username.");
                return;
            }

        });

        return () => unsubscribe();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRegister = () => {

        const trimmedUser = username.trim();
        const trimmedPass = password.trim();

        if (!trimmedUser || !trimmedPass) {
            setError("Please enter a username and password.");
            return;
        }

        setError("");
        setSubmitting(true);

        socket.send({
            type: "REGISTER",
            username: trimmedUser,
            password: trimmedPass
        });

    };

    return (

        <div className="auth-container">

            <div className="auth-box">

                <h2>Register</h2>

                <input
                    type="text"
                    value={username}
                    placeholder="Username"
                    disabled={submitting}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    disabled={submitting}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleRegister();
                    }}
                />

                {error && <div className="auth-error">{error}</div>}

                <button disabled={submitting} onClick={handleRegister}>
                    {submitting ? "Registering..." : "Register"}
                </button>

                <div className="auth-switch">
                    Already have an account?{" "}
                    <button className="link-button" onClick={onGoToLogin}>
                        Log In
                    </button>
                </div>

            </div>

        </div>

    );
}

export default Register;