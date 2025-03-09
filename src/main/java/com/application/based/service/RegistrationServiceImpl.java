package com.application.based.service;

import com.application.based.entity.User;
import com.application.based.entity.VerificationToken;
import com.application.based.model.UserModel;
import com.application.based.repository.UserRepository;
import com.application.based.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Calendar;

@Service
public class RegistrationServiceImpl implements RegistrationService{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Override
    public User registerUser(UserModel userModel){
        User user = User.builder()
                .email(userModel.getEmail())
                .profilePicture(userModel.getProfilePicture())
                .username(userModel.getUserName())
                .status("Offline")
                .password(passwordEncoder.encode(userModel.getPassword())).build();

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


}
