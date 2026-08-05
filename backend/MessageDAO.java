package backend;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MessageDAO {

    // Save Private Message
    public void saveMessage(Message msg) {

        String sql = "INSERT INTO messages(sender,receiver,message) VALUES(?,?,?)";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, msg.getSender());
            ps.setString(2, msg.getReceiver());
            ps.setString(3, msg.getMessage());

            ps.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Get Chat History
    public List<Message> getMessages(String sender, String receiver) {

        List<Message> list = new ArrayList<>();

        String sql = """
                SELECT * FROM messages
                WHERE (sender=? AND receiver=?)
                   OR (sender=? AND receiver=?)
                ORDER BY sent_time
                """;

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, sender);
            ps.setString(2, receiver);
            ps.setString(3, receiver);
            ps.setString(4, sender);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                Message m = new Message();

                m.setId(rs.getInt("id"));
                m.setSender(rs.getString("sender"));
                m.setReceiver(rs.getString("receiver"));
                m.setMessage(rs.getString("message"));
                m.setSentTime(rs.getTimestamp("sent_time"));

                list.add(m);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }
}
