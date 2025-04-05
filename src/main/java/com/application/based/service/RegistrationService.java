package com.application.based.service;

import com.application.based.entity.User;
import com.application.based.entity.VerificationToken;
import com.application.based.model.RegisterModel;

public interface RegistrationService {

    User registerUser(RegisterModel registerModel);

    public void saveVerificationTokenForUser(String token, User user);

    public String validateVerificationToken(String token);

    public VerificationToken generateNewVerificationToken(String oldToken);
}
