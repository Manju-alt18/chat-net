const net = require("net");
const WebSocket = require("ws");

const TCP_HOST = "127.0.0.1";
const TCP_PORT = 5000;
const WS_PORT = 8080;

const wss = new WebSocket.Server({
    port: WS_PORT
});

console.log("=================================");
console.log(" WebSocket Bridge Started");
console.log(" WebSocket : 8080");
console.log(" TCP       : 5000");
console.log("=================================");

wss.on("connection", (ws) => {

    console.log("React client connected");

    const tcpClient = new net.Socket();

    tcpClient.connect(TCP_PORT, TCP_HOST, () => {

        console.log("Connected to Java TCP Server");

    });

    // React → Java
    ws.on("message", (data) => {

        const message = data.toString();

        console.log("React → Java:", message);

        tcpClient.write(message + "\n");
    });

    // Java → React
    tcpClient.on("data", (data) => {

        const message = data.toString().trim();

        console.log("Java → React:", message);

        ws.send(message);
    });

    tcpClient.on("error", (error) => {

        console.log(
            "TCP Error:",
            error.message
        );
    });

    tcpClient.on("close", () => {

        console.log(
            "Java TCP connection closed"
        );

        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
    });

    ws.on("close", () => {

        console.log(
            "React client disconnected"
        );

        tcpClient.destroy();
    });
});