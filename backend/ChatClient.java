package backend;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

public class ChatClient {

    private static final String HOST = "127.0.0.1";
    private static final int PORT = 5000;

    public static void main(String[] args) {

        try {

            Socket socket = new Socket(HOST, PORT);

            System.out.println("Connected to server.");
            System.out.println("Server: " + socket.getRemoteSocketAddress());

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(
                                    socket.getInputStream()));

            PrintWriter writer =
                    new PrintWriter(
                            socket.getOutputStream(),
                            true);

            Scanner scanner = new Scanner(System.in);

            // =========================
            // LOGIN
            // =========================

            System.out.print("Enter username: ");

            String username = scanner.nextLine().trim();

            writer.println("LOGIN:" + username);

            System.out.println("Login request sent.");

            // =========================
            // RECEIVING THREAD
            // =========================

            Thread receiver = new Thread(() -> {

                try {

                    String message;

                    while ((message = reader.readLine()) != null) {

                        System.out.println();
                        System.out.println();
                        System.out.println("========== MESSAGE ==========");
                        System.out.println(message);
                        System.out.println("=============================");
                        System.out.print("> ");

                    }

                    System.out.println(
                            "\nServer closed the connection.");

                } catch (IOException e) {

                    System.out.println(
                            "\nConnection lost: "
                            + e.getMessage());
                }

            });

            receiver.start();

            // =========================
            // COMMANDS
            // =========================

            System.out.println();
            System.out.println("Logged in as: " + username);

            System.out.println();
            System.out.println("Commands:");
            System.out.println("MSG:username:message");
            System.out.println("ONLINE");
            System.out.println("HISTORY:username");
            System.out.println("LOGOUT");
            System.out.println();

            // =========================
            // SEND LOOP
            // =========================

            while (true) {

                System.out.print("> ");

                String input = scanner.nextLine();

                if (input.trim().isEmpty()) {
                    continue;
                }

                writer.println(input);
                writer.flush();

                if (input.equalsIgnoreCase("LOGOUT")) {
                    break;
                }
            }

            socket.close();
            scanner.close();

        } catch (IOException e) {

            System.out.println(
                    "Could not connect to server.");

            System.out.println(
                    "Make sure the Java server is running.");

            e.printStackTrace();
        }
    }
}