// App.jsx
import { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

function App() {

    const [user, setUser] = useState(null);

    return (

        <div>

            {
                user ?

                <Chat
                    username={user}
                />

                :

                <Login
                    setUser={setUser}
                />
            }

        </div>

    );

}

export default App;