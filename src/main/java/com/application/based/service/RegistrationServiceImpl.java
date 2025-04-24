package com.application.based.service;

import com.application.based.entity.Role;
import com.application.based.entity.User;
import com.application.based.entity.VerificationToken;
import com.application.based.model.RegisterModel;
import com.application.based.repository.RoleRepository;
import com.application.based.repository.UserRepository;
import com.application.based.repository.VerificationTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static com.application.based.util.PrivacyUtil.maskEmail;

@Slf4j
@Service
public class RegistrationServiceImpl implements RegistrationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public User registerUser(RegisterModel registerModel) {
        log.info("Attempting to register new user: {}", registerModel.getUsername());

        if (userRepository.existsByUsername(registerModel.getUsername())) {
            log.warn("Registration failed - Username already exists: {}", registerModel.getUsername());
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(registerModel.getEmail())) {
            log.warn("Registration failed - Email already registered: {}", maskEmail(registerModel.getEmail()));
            throw new RuntimeException("Email already registered");
        }

        Set<Role> roles = new HashSet<>();
        if (registerModel.getRoles() != null) {
            log.debug("Processing roles for new user: {}", registerModel.getRoles());
            for (String roleName : registerModel.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> {
                            log.error("Registration failed - Role not found: {}", roleName);
                            return new RuntimeException("Role not found: " + roleName);
                        });
                roles.add(role);
            }
        }

        User user = User.builder()
                .username(registerModel.getUsername())
                .email(registerModel.getEmail())
                .password(passwordEncoder.encode(registerModel.getPassword()))
                .profilePicture(registerModel.getProfilePicture())
                .status(registerModel.getStatus())
                .enabled(registerModel.getEnabled() != null ? registerModel.getEnabled() : false)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Successfully registered new user - ID: {}, Username: {}",
                 savedUser.getId(), savedUser.getUsername());
        return savedUser;
    }

    @Override
    public void saveVerificationTokenForUser(String token, User user) {
        log.debug("Generating verification token for user: {}", user.getUsername());
        VerificationToken verificationToken = new VerificationToken(user, token);
        verificationTokenRepository.save(verificationToken);
        log.trace("Verification token created - Token: {}, Expires: {}",
                  token, verificationToken.getExpirationTime());
    }

    @Override
    public String validateVerificationToken(String token) {
        log.debug("Validating JWT token");
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token);

        if (verificationToken == null) {
            log.warn("Invalid JWT token provided");
            return "invalid";
        }

        User user = verificationToken.getUser();
        Calendar calendar = Calendar.getInstance();

        if ((verificationToken.getExpirationTime().getTime() - calendar.getTime().getTime()) <= 0) {
            log.warn("Expired JWT token for user: {}", user.getUsername());
            verificationTokenRepository.delete(verificationToken);
            return "expired";
        }

        user.setEnabled(true);
        userRepository.save(user);
        log.info("Successfully verified user account - Username: {}", user.getUsername());
        return "valid";
    }

    @Override
    public VerificationToken generateNewVerificationToken(String oldToken) {
        log.info("Generating new JWT token to replace: {}", oldToken);
        VerificationToken verificationToken = verificationTokenRepository.findByToken(oldToken);
        String newToken = UUID.randomUUID().toString();
        verificationToken.setToken(newToken);
        verificationTokenRepository.save(verificationToken);
        log.debug("Token regenerated - Old: {}, New: {}", oldToken, newToken);
        return verificationToken;
    }
}