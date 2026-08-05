// AuthService.java
package backend;

public class AuthService {

    private UserDAO userDAO = new UserDAO();

    // Register
    public boolean register(String username,
                            String password,
                            String fullname) {

        if (userDAO.userExists(username)) {

            return false;

        }

        User user = new User(username,
                password,
                fullname);

        return userDAO.register(user);
    }

    // Login
    public boolean login(String username,
                         String password) {

        return userDAO.login(username,
                password);

    }

    // Logout
    public void logout(String username) {

        userDAO.updateStatus(username,
                "OFFLINE");

    }

}