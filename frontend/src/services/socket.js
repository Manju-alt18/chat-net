class ChatSocket {

    constructor() {
        this.socket = null;
        this.listeners = [];
        this.statusListeners = [];
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

            this.listeners.forEach((listener) => {
                listener(event.data);
            });
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

        this.listeners.push(callback);

        // Return cleanup function
        return () => {

            this.listeners =
                this.listeners.filter(
                    (listener) =>
                        listener !== callback
                );
        };
    }

    addStatusListener(callback) {

        this.statusListeners.push(callback);

        return () => {

            this.statusListeners =
                this.statusListeners.filter(
                    (listener) =>
                        listener !== callback
                );
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
                this.socket.readyState ===
                WebSocket.OPEN
            ) {

                this.socket.send("LOGOUT");
            }

            this.socket.close();

            this.socket = null;
        }
    }
}

export default new ChatSocket();