class ChatSocket {

    constructor() {

        this.socket = null;
        this.callback = null;

    }

    connect() {

        this.socket = new WebSocket(
            "ws://localhost:8080"
        );

        this.socket.onopen = () => {

            console.log(
                "Connected to WebSocket Bridge"
            );

        };

        this.socket.onmessage = (event) => {

            console.log(
                "Received:",
                event.data
            );

            if (this.callback) {

                try {

                    const data =
                        JSON.parse(event.data);

                    this.callback(data);

                } catch (error) {

                    console.log(
                        "Invalid response:",
                        event.data
                    );

                }

            }

        };

        this.socket.onclose = () => {

            console.log(
                "WebSocket disconnected"
            );

        };

        this.socket.onerror = (error) => {

            console.log(
                "WebSocket error:",
                error
            );

        };

    }

    send(data) {

        if (!this.socket) {

            console.log(
                "Socket is not connected"
            );

            return;

        }

        if (this.socket.readyState !== WebSocket.OPEN) {

            console.log(
                "WebSocket is not open"
            );

            return;

        }

        this.socket.send(data);

    }

    receive(callback) {

        this.callback = callback;

    }

}

export default new ChatSocket();