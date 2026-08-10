package backend;

import java.io.*;
import java.net.Socket;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ClientHandler extends Thread {

    private Socket socket;
    private BufferedReader reader;
    private PrintWriter writer;

    private String username;

    private UserDAO userDAO = new UserDAO();
    private MessageDAO messageDAO = new MessageDAO();

    public ClientHandler(Socket socket) {

        this.socket = socket;

        try {

            reader = new BufferedReader(
                    new InputStreamReader(
                            socket.getInputStream()));

            writer = new PrintWriter(
                    socket.getOutputStream(),
                    true);

        } catch (IOException e) {

            e.printStackTrace();
        }
    }

    @Override
    public void run() {

        try {

            String input;

            while ((input = reader.readLine()) != null) {

                System.out.println(
                        "Received from client: " + input);

                String[] parts = input.split(":", 3);

                String command = parts[0];

                switch (command) {

                    // =========================
                    // LOGIN
                    // =========================
                    case "LOGIN":

                        if (parts.length < 2) {
                            writer.println("LOGIN_FAILED");
                            break;
                        }

                        username = parts[1];

                        ChatServer.onlineUsers.put(
                                username,
                                this);

                        System.out.println(
                                username +
                                " Logged In");

                        System.out.println(
                                "Online users: " +
                                ChatServer.onlineUsers.keySet());

                        try {

                            userDAO.updateStatus(
                                    username,
                                    "ONLINE");

                        } catch (Exception e) {

                            System.out.println(
                                    "Database status update failed: "
                                    + e.getMessage());

                        }

                        writer.println(
                                "LOGIN_SUCCESS");

                        break;


                    // =========================
                    // PRIVATE MESSAGE
                    // =========================
                    case "MSG":

                        if (parts.length < 3) {

                            writer.println(
                                    "INVALID_MESSAGE");

                            break;
                        }

                        String receiver = parts[1];
                        String message = parts[2];

                        System.out.println(
                                "Message from " +
                                username +
                                " to " +
                                receiver +
                                ": " +
                                message);

                        // Find receiver FIRST
                        ClientHandler client =
                                ChatServer.onlineUsers.get(
                                        receiver);

                        if (client != null) {

                            String time =
                                    LocalDateTime.now()
                                            .format(
                                                DateTimeFormatter
                                                .ofPattern(
                                                    "HH:mm:ss"));

                            String formattedMessage =
                                    "MESSAGE:" +
                                    username +
                                    ":" +
                                    message +
                                    ":" +
                                    time;

                            // Send message to receiver
                            client.sendMessage(
                                    formattedMessage);

                            System.out.println(
                                    "Message delivered to "
                                    + receiver);

                            // Try saving to database
                            // AFTER delivery
                            try {

                                Message msg =
                                        new Message(
                                                username,
                                                receiver,
                                                message);

                                messageDAO.saveMessage(msg);

                            } catch (Exception e) {

                                System.out.println(
                                        "Database save failed: "
                                        + e.getMessage());

                                // Do NOT disconnect user
                            }

                        } else {

                            System.out.println(
                                    receiver +
                                    " is OFFLINE");

                            writer.println(
                                    "USER_OFFLINE");
                        }

                        break;


                    // =========================
                    // ONLINE USERS
                    // =========================
                    case "ONLINE":

                        for (String user :
                                ChatServer.onlineUsers.keySet()) {

                            writer.println(
                                    "USER:" + user);
                        }

                        writer.println("END");

                        break;


                    // =========================
                    // HISTORY
                    // =========================
                    case "HISTORY":

                        if (parts.length < 2) {
                            break;
                        }

                        try {

                            HistoryService history =
                                    new HistoryService();

                            history.printHistory(
                                    username,
                                    parts[1]);

                        } catch (Exception e) {

                            System.out.println(
                                    "History error: "
                                    + e.getMessage());

                        }

                        break;


                    // =========================
                    // LOGOUT
                    // =========================
                    case "LOGOUT":

                        logout();

                        return;


                    default:

                        writer.println(
                                "UNKNOWN_COMMAND");

                        break;
                }
            }

        } catch (IOException e) {

            System.out.println(
                    username +
                    " connection closed.");

            logout();

        } catch (Exception e) {

            e.printStackTrace();

            logout();
        }
    }


    // =========================
    // SEND MESSAGE
    // =========================
    public void sendMessage(String msg) {

        if (writer != null) {

            writer.println(msg);

            writer.flush();

            System.out.println(
                    "Sending to " +
                    username +
                    ": " +
                    msg);
        }
    }


    // =========================
    // LOGOUT
    // =========================
    private void logout() {

        try {

            if (username != null) {

                ChatServer.onlineUsers.remove(
                        username);

                try {

                    userDAO.updateStatus(
                            username,
                            "OFFLINE");

                } catch (Exception e) {

                    System.out.println(
                            "Database update failed.");
                }

                System.out.println(
                        username +
                        " Logged Out");
            }

            if (socket != null &&
                    !socket.isClosed()) {

                socket.close();
            }

        } catch (IOException e) {

            e.printStackTrace();
        }
    }
}