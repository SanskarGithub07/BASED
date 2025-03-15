package com.application.based.service;

import com.application.based.entity.User;

import java.util.Optional;

public interface UserService {
    public User getUserByEmailId(String emailId);

    void createPasswordResetTokenForUser(User user, String token);

    public String validatePasswordResetToken(String token);

    public Optional<User> getUserByPasswordResetToken(String token);

    public void changePassword(User user, String newPassword);

    public boolean checkIfValidOldPassword(User user, String oldPassword);
}
