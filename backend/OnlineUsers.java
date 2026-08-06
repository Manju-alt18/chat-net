package backend;

import java.util.Set;

public class OnlineUsers {

    // Get all online users
    public static Set<String> getOnlineUsers() {

        return ChatServer.onlineUsers.keySet();

    }

    // Check if a user is online
    public static boolean isOnline(String username) {

        return ChatServer.onlineUsers.containsKey(username);

    }

    // Display online users on the server console
    public static void printOnlineUsers() {

        System.out.println("\n====== ONLINE USERS ======");

        if(ChatServer.onlineUsers.isEmpty()) {

            System.out.println("No users online.");

        } else {

            for(String user : ChatServer.onlineUsers.keySet()) {

                System.out.println(user);

            }

        }

        System.out.println("==========================");

    }

}