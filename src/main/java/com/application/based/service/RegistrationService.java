package com.application.based.service;

import com.application.based.entity.User;
import com.application.based.model.UserModel;

public interface RegistrationService {

    public User registerUser(UserModel userModel);

    public void saveVerificationTokenForUser(String token, User user);

    public String validateVerificationToken(String token);
}
