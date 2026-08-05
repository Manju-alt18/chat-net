/package backend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final String URL = "jdbc:mysql://localhost:3306/chatapp";
    private static final String USER = "root";
    private static final String PASSWORD = "root";   // Change to your MySQL password

    public static Connection getConnection() {

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            return DriverManager.getConnection(URL, USER, PASSWORD);

        } catch (ClassNotFoundException e) {
            System.out.println("MySQL Driver Not Found");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("Database Connection Failed");
            e.printStackTrace();
        }

        return null;
    }
}/ DBConnection.java
