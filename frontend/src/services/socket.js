class ChatSocket {

    constructor() {

        this.socket = null;
        this.callback = null;

    }


    connect(username) {

        // Don't create another connection
        if (
            this.socket &&
            this.socket.readyState === WebSocket.OPEN
        ) {
            return;
        }

        this.socket =
            new WebSocket("ws://localhost:8080");


        this.socket.onopen = () => {

            console.log(
                "WebSocket connected"
            );

            // Login to Java server
            this.socket.send(
                "LOGIN:" + username
            );

            console.log(
                "Sent:",
                "LOGIN:" + username
            );

        };


        this.socket.onmessage = (event) => {

            console.log(
                "Java → React:",
                event.data
            );

            if (this.callback) {

                this.callback(
                    event.data
                );

            }

        };


        this.socket.onerror = (error) => {

            console.error(
                "WebSocket error:",
                error
            );

        };


        this.socket.onclose = () => {

            console.log(
                "WebSocket disconnected"
            );

            this.socket = null;

        };

    }


    send(data) {

        if (!this.socket) {

            console.error(
                "Socket does not exist"
            );

            return;

        }


        if (
            this.socket.readyState !==
            WebSocket.OPEN
        ) {

            console.error(
                "WebSocket is not connected"
            );

            return;

        }


        if (
            data.type ===
            "PRIVATE_MESSAGE"
        ) {

            const command =
                "MSG:" +
                data.receiver +
                ":" +
                data.text;


            console.log(
                "React → Java:",
                command
            );


            this.socket.send(
                command
            );

        }

    }


    receive(callback) {

        this.callback = callback;

    }

}


export default new ChatSocket();