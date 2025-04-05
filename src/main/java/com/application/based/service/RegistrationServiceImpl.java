package com.application.based.service;

import com.application.based.entity.Role;
import com.application.based.entity.User;
import com.application.based.entity.VerificationToken;
import com.application.based.model.RegisterModel;
import com.application.based.repository.RoleRepository;
import com.application.based.repository.UserRepository;
import com.application.based.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class RegistrationServiceImpl implements RegistrationService{
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
        if (userRepository.existsByUsername(registerModel.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(registerModel.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Set<Role> roles = new HashSet<>();
        if (registerModel.getRoles() != null) {
            for (String roleName : registerModel.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
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

        return userRepository.save(user);
    }



    @Override
    public void saveVerificationTokenForUser(String token, User user){
        VerificationToken verificationToken = new VerificationToken(user, token);
        verificationTokenRepository.save(verificationToken);
    }

    @Override
    public String validateVerificationToken(String token){
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token);
        if(verificationToken == null){
            return "invalid";
        }

        User user = verificationToken.getUser();
        Calendar calendar = Calendar.getInstance();

        if((verificationToken.getExpirationTime().getTime() - calendar.getTime().getTime()) <= 0){
            verificationTokenRepository.delete(verificationToken);
            return "expired";
        }

        user.setEnabled(true);
        userRepository.save(user);
        return "valid";
    }

    @Override
    public VerificationToken generateNewVerificationToken(String oldToken){
        VerificationToken verificationToken = verificationTokenRepository.findByToken(oldToken);
        verificationToken.setToken(UUID.randomUUID().toString());
        verificationTokenRepository.save(verificationToken);
        return verificationToken;
    }

}
