package backend;

import java.util.List;

public class HistoryService {

    private MessageDAO messageDAO =
            new MessageDAO();

    public void printHistory(String sender,
                             String receiver) {

        List<Message> history =
                messageDAO.getMessages(sender,
                        receiver);

        System.out.println();

        System.out.println("========== CHAT HISTORY ==========");

        for(Message msg : history) {

            System.out.println(
                    msg.getSender()
                    + " -> "
                    + msg.getReceiver()
                    + " : "
                    + msg.getMessage()
                    + " ("
                    + msg.getSentTime()
                    + ")");

        }

        System.out.println("==================================");

    }

}