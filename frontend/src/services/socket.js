class ChatSocket {

    constructor() {
        this.socket = null;
        this.callback = null;
    }

    connect(username) {

        this.socket = new WebSocket("ws://localhost:8080");

        this.socket.onopen = () => {

            console.log("WebSocket connected");

            // Login to Java TCP server
            this.socket.send("LOGIN:" + username);

        };

        this.socket.onmessage = (event) => {

            console.log("Server received:", event.data);

            if (this.callback) {
                this.callback(event.data);
            }

        };

        this.socket.onclose = () => {
            console.log("WebSocket disconnected");
        };

        this.socket.onerror = (error) => {
            console.log("WebSocket error:", error);
        };
    }

    send(data) {

        if (!this.socket) {
            console.log("Socket does not exist");
            return;
        }

        if (this.socket.readyState !== WebSocket.OPEN) {
            console.log("Socket is not connected");
            return;
        }

        /*
         * Send the format expected by Java ClientHandler:
         *
         * MSG:receiver:message
         */

        if (data.type === "PRIVATE_MESSAGE") {

            const command =
                "MSG:" +
                data.receiver +
                ":" +
                data.text;

            console.log("Sending to Java:", command);

            this.socket.send(command);
        }
    }

    receive(callback) {
        this.callback = callback;
    }
}

export default new ChatSocket();