// ChatService.java
package backend;

import java.sql.Timestamp;

public class ChatService {

    private MessageDAO messageDAO = new MessageDAO();

    // Private Message
    public void sendPrivateMessage(String sender,
                                   String receiver,
                                   String text) {

        Message message = new Message(sender, receiver, text);

        messageDAO.saveMessage(message);

        ClientHandler client =
                ChatServer.onlineUsers.get(receiver);

        if (client != null) {

            Timestamp time = new Timestamp(System.currentTimeMillis());

            client.sendMessage(
                    "[PRIVATE] "
                    + sender
                    + " : "
                    + text
                    + " ("
                    + time
                    + ")");

        }
    }

    // Broadcast Message
    public void broadcast(String sender,
                          String message) {

        Timestamp time =
                new Timestamp(System.currentTimeMillis());

        for (ClientHandler client :
                ChatServer.onlineUsers.values()) {

            client.sendMessage(
                    "[BROADCAST] "
                    + sender
                    + " : "
                    + message
                    + " ("
                    + time
                    + ")");
        }
    }

}