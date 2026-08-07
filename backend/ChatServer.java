package backend;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ConcurrentHashMap;

public class ChatServer {

    public static final int PORT = 5000;

    // Stores all online users
    public static ConcurrentHashMap<String, ClientHandler> onlineUsers =
            new ConcurrentHashMap<>();

    public void startServer() {

        try (ServerSocket serverSocket = new ServerSocket(PORT)) {

            System.out.println("=================================");
            System.out.println(" Chat Server Started");
            System.out.println(" Listening on Port : " + PORT);
            System.out.println("=================================");

            while (true) {

                Socket socket = serverSocket.accept();

                System.out.println("New Client Connected : "
                        + socket.getInetAddress());

                ClientHandler client = new ClientHandler(socket);

                client.start();

            }

        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}