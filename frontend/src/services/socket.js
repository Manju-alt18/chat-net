class ChatSocket {

    constructor() {
        this.socket = null;

        // Set prevents duplicate listeners
        this.listeners = new Set();

        this.statusListeners = new Set();
    }

    connect(username) {

        if (
            this.socket &&
            (
                this.socket.readyState === WebSocket.OPEN ||
                this.socket.readyState === WebSocket.CONNECTING
            )
        ) {
            return;
        }

        console.log("Connecting to chat server...");

        this.socket = new WebSocket(
            "ws://localhost:8080"
        );

        this.socket.onopen = () => {

            console.log("WebSocket connected");

            this.socket.send(
                "LOGIN:" + username
            );

            this.notifyStatus("connected");
        };

        this.socket.onmessage = (event) => {

            console.log(
                "Server → React:",
                event.data
            );

            // Notify each listener exactly once
            this.listeners.forEach(
                (listener) => {
                    listener(event.data);
                }
            );
        };

        this.socket.onerror = (error) => {

            console.error(
                "WebSocket error:",
                error
            );

            this.notifyStatus("error");
        };

        this.socket.onclose = () => {

            console.log(
                "WebSocket disconnected"
            );

            this.notifyStatus("disconnected");

            this.socket = null;
        };
    }


    sendMessage(receiver, message) {

        if (
            !this.socket ||
            this.socket.readyState !== WebSocket.OPEN
        ) {

            console.error(
                "Socket is not connected"
            );

            return false;
        }

        const command =
            "MSG:" +
            receiver +
            ":" +
            message;

        console.log(
            "React → Server:",
            command
        );

        this.socket.send(command);

        return true;
    }


    getOnlineUsers() {

        if (
            this.socket &&
            this.socket.readyState === WebSocket.OPEN
        ) {
            this.socket.send("ONLINE");
        }
    }


    addMessageListener(callback) {

        this.listeners.add(callback);

        return () => {

            this.listeners.delete(callback);

        };
    }


    addStatusListener(callback) {

        this.statusListeners.add(callback);

        return () => {

            this.statusListeners.delete(callback);

        };
    }


    notifyStatus(status) {

        this.statusListeners.forEach(
            (listener) => {
                listener(status);
            }
        );
    }


    disconnect() {

        if (this.socket) {

            if (
                this.socket.readyState === WebSocket.OPEN
            ) {
                this.socket.send("LOGOUT");
            }

            this.socket.close();

            this.socket = null;
        }
    }
}

export default new ChatSocket();