class ChatSocket {

    constructor() {
        this.socket = null;
        this.listeners = [];
    }

    connect(username) {

        // Don't create another connection
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            return;
        }

        this.socket = new WebSocket("ws://localhost:8080");

        this.socket.onopen = () => {
            console.log("WebSocket connected");
            this.socket.send("LOGIN:" + username);
            console.log("Sent:", "LOGIN:" + username);
        };

        this.socket.onmessage = (event) => {
            console.log("Java → React:", event.data);
            // Notify every registered listener, not just one.
            this.listeners.forEach((cb) => cb(event.data));
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        this.socket.onclose = () => {
            console.log("WebSocket disconnected");
            this.socket = null;
        };

    }

    send(data) {

        if (!this.socket) {
            console.error("Socket does not exist");
            return;
        }

        if (this.socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected");
            return;
        }

        if (data.type === "PRIVATE_MESSAGE") {

            const command = "MSG:" + data.receiver + ":" + data.text;
            console.log("React → Java:", command);
            this.socket.send(command);

        } else if (data.type === "REGISTER") {

            // ASSUMPTION — confirm this matches the server's expected format.
            const command = "REGISTER:" + data.username + ":" + data.password;
            console.log("React → Java:", command);
            this.socket.send(command);

        } else if (data.type === "RAW") {

            // Escape hatch for any other plain-string command.
            console.log("React → Java:", data.text);
            this.socket.send(data.text);

        }

    }

    // Registers a listener and returns an unsubscribe function, so
    // components can stop listening on unmount without closing the
    // shared socket connection.
    receive(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter((cb) => cb !== callback);
        };
    }

}

export default new ChatSocket();