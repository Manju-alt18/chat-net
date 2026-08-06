package backend;

import java.io.*;
import java.net.Socket;

public class ClientHandler extends Thread {

    private Socket socket;
    private BufferedReader reader;
    private PrintWriter writer;

    private String username;

    UserDAO userDAO = new UserDAO();
    MessageDAO messageDAO = new MessageDAO();

    public ClientHandler(Socket socket) {

        this.socket = socket;

        try {

            reader = new BufferedReader(
                    new InputStreamReader(socket.getInputStream()));

            writer = new PrintWriter(
                    socket.getOutputStream(), true);

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    @Override
    public void run() {

        try {

            while (true) {

                String input = reader.readLine();

                if (input == null)
                    break;

                String[] parts = input.split(":", 4);

                String command = parts[0];

                switch (command) {

                    case "LOGIN":

                        username = parts[1];

                        ChatServer.onlineUsers.put(username, this);

                        userDAO.updateStatus(username, "ONLINE");

                        writer.println("LOGIN_SUCCESS");

                        System.out.println(username + " Logged In");

                        break;

                    case "MSG":

                        String receiver = parts[1];
                        String message = parts[2];

                        Message msg = new Message(username,
                                receiver,
                                message);

                        messageDAO.saveMessage(msg);

                        ClientHandler client =
                                ChatServer.onlineUsers.get(receiver);

                        if (client != null) {

                            client.sendMessage(
                                    username +
                                    ": " +
                                    message);

                        } else {

                            writer.println("USER_OFFLINE");

                        }

                        break;

                    case "LOGOUT":

                        logout();

                        return;
                        case "ONLINE":

    for(String user : OnlineUsers.getOnlineUsers()){

        writer.println(user);

    }

    writer.println("END");

    break;

    case "HISTORY":

    HistoryService history =
            new HistoryService();

    history.printHistory(
            username,
            parts[1]);

    break;

                }

            }

        } catch (Exception e) {

            logout();

        }

    }

    public void sendMessage(String msg) {

        writer.println(msg);

    }

    private void logout() {

        try {

            if (username != null) {

                ChatServer.onlineUsers.remove(username);

                userDAO.updateStatus(username,
                        "OFFLINE");

                System.out.println(username + " Logged Out");

            }

            socket.close();

        } catch (IOException e) {

            e.printStackTrace();

        }

    }

}
