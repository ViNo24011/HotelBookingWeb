package com.example.ttcs_be.service;

import com.example.ttcs_be.model.User;
import java.util.List;

public interface IUserService {
    User registerUser(User user);
    List<User> getUsers();
    void deleteUser(String email);
    User getUser(String email);

    User updateUserRole(String email, String roleName);
    void processRegistration(User user);
    String validateOtpAndSaveUser(String email, String otp);
    void changePassword(Long userId, String oldPassword, String newPassword);
    long countTotalUsers();

    void requestPasswordReset(String email);

    void resetPasswordWithOtp(String email, String otp, String newPassword);
}
