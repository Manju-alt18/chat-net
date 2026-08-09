// ChatClient.java
package backend;

import java.io.*;
import java.net.Socket;
import java.util.Scanner;

public class ChatClient {

    private static final String HOST = "localhost";
    private static final int PORT = 5000;

    public static void main(String[] args) {

        try (
            Socket socket = new Socket(HOST, PORT);

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(
                                    socket.getInputStream()));

            PrintWriter writer =
                    new PrintWriter(
                            socket.getOutputStream(),
                            true);

            Scanner scanner = new Scanner(System.in)
        ) {

            System.out.println("=================================");
            System.out.println("      JAVA CHAT CLIENT");
            System.out.println("=================================");

            // Login
            System.out.print("Enter username: ");

            String username = scanner.nextLine();

            writer.println("LOGIN:" + username);

            // Thread for receiving messages
            Thread receiveThread = new Thread(() -> {

                try {

                    String message;

                    while ((message = reader.readLine()) != null) {

                        System.out.println();
                        System.out.println("Received: " + message);
                        System.out.print("> ");

                    }

                } catch (IOException e) {

                    System.out.println(
                            "Disconnected from server.");

                }

            });

            receiveThread.start();

            System.out.println();
            System.out.println("Logged in as: " + username);

            System.out.println();
            System.out.println("Commands:");
            System.out.println("MSG:username:message");
            System.out.println("ONLINE");
            System.out.println("HISTORY:username");
            System.out.println("LOGOUT");

            System.out.println();

            // Send messages
            while (true) {

                System.out.print("> ");

                String input = scanner.nextLine();

                if (input.equalsIgnoreCase("LOGOUT")) {

                    writer.println("LOGOUT");

                    break;
                }

                writer.println(input);
            }

        } catch (IOException e) {

            System.out.println(
                    "Unable to connect to server.");

            System.out.println(
                    "Make sure ChatServer is running.");

            e.printStackTrace();
        }
    }
}