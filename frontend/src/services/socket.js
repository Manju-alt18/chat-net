// socket.js
class ChatSocket {

    constructor() {

        this.socket = null;

    }

    connect() {

        this.socket = new WebSocket("ws://localhost:8080/chat");

        this.socket.onopen = () => {

            console.log("Connected");

        };

        this.socket.onclose = () => {

            console.log("Disconnected");

        };

        this.socket.onerror = (error) => {

            console.log(error);

        };

    }

    send(data) {

        if(this.socket &&
            this.socket.readyState===1){

            this.socket.send(
                JSON.stringify(data)
            );

        }

    }

    receive(callback){

        this.socket.onmessage=(event)=>{

            callback(
                JSON.parse(event.data)
            );

        };

    }

}

export default new ChatSocket();