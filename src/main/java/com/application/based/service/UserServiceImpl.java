package com.application.based.service;

import com.application.based.entity.PasswordResetToken;
import com.application.based.entity.User;
import com.application.based.repository.PasswordResetTokenRepository;
import com.application.based.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Optional;

import static com.application.based.util.PrivacyUtil.maskEmail;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User getUserByEmailId(String emailId) {
        log.debug("Fetching user by email: {}", maskEmail(emailId));
        User user = userRepository.findByEmail(emailId)
                .orElseThrow(() -> {
                    log.warn("User not found with email: {}", maskEmail(emailId));
                    return new RuntimeException("User not found");
                });
        log.trace("Found user details for email: {}", maskEmail(emailId));
        return user;
    }

    @Override
    public void createPasswordResetTokenForUser(User user, String token) {
        log.info("Creating password reset token for user: {}", user.getUsername());
        PasswordResetToken passwordResetToken = new PasswordResetToken(user, token);
        passwordResetTokenRepository.save(passwordResetToken);
        log.debug("Password reset token created - Expires: {}",
                  passwordResetToken.getExpirationTime());
    }

    @Override
    public String validatePasswordResetToken(String token) {
        log.debug("Validating password reset token");
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token);

        if (passwordResetToken == null) {
            log.warn("Invalid password reset token provided");
            return "invalid";
        }

        User user = passwordResetToken.getUser();
        Calendar calendar = Calendar.getInstance();

        if ((passwordResetToken.getExpirationTime().getTime() - calendar.getTime().getTime()) <= 0) {
            log.warn("Expired password reset token for user: {}", user.getUsername());
            passwordResetTokenRepository.delete(passwordResetToken);
            return "expired";
        }

        log.info("Valid password reset token for user: {}", user.getUsername());
        return "valid";
    }

    @Override
    public Optional<User> getUserByPasswordResetToken(String token) {
        log.debug("Fetching user by password reset token");
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token);
        if (passwordResetToken == null) {
            log.warn("No user found for password reset token");
            return Optional.empty();
        }
        log.trace("Found user {} for password reset token",
                  passwordResetToken.getUser().getUsername());
        return Optional.of(passwordResetToken.getUser());
    }

    @Override
    public void changePassword(User user, String newPassword) {
        log.info("Changing password for user: {}", user.getUsername());
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.debug("Password successfully changed for user: {}", user.getUsername());
    }

    @Override
    public boolean checkIfValidOldPassword(User user, String oldPassword) {
        log.debug("Validating old password for user: {}", user.getUsername());
        boolean isValid = passwordEncoder.matches(oldPassword, user.getPassword());
        if (!isValid) {
            log.warn("Invalid old password provided for user: {}", user.getUsername());
        }
        return isValid;
    }
}