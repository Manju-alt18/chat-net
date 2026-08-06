// Register.jsx
import { useState } from "react";

function Register() {

    const [fullname,setFullname]=useState("");
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");

    const register=()=>{

        if(fullname==="" ||
           username==="" ||
           password===""){

            alert("Fill all fields");
            return;
        }

        if(password!==confirmPassword){

            alert("Passwords do not match");
            return;

        }

        // Send data to Java Backend later
        alert("Registered Successfully");

    }

    return(

        <div className="login-container">

            <div className="login-card">

                <h1>Create Account</h1>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e)=>setFullname(e.target.value)}
                />

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

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                />

                <button onClick={register}>
                    Register
                </button>

            </div>

        </div>

    );

}

export default Register;