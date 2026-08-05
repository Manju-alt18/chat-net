package backend;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class GroupDAO {

    // Create Group
    public boolean createGroup(String groupName, String createdBy) {

        String sql = "INSERT INTO chat_groups(group_name,created_by) VALUES(?,?)";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, groupName);
            ps.setString(2, createdBy);

            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }

    // Add Member
    public void addMember(int groupId, String username) {

        String sql = "INSERT INTO group_members(group_id,username) VALUES(?,?)";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, groupId);
            ps.setString(2, username);

            ps.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }

    }

    // Get Members
    public List<String> getMembers(int groupId) {

        List<String> members = new ArrayList<>();

        String sql = "SELECT username FROM group_members WHERE group_id=?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, groupId);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                members.add(rs.getString("username"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return members;
    }

}
