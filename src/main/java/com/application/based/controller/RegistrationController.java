package com.application.based.controller;

import com.application.based.entity.User;
import com.application.based.event.RegistrationCompleteEvent;
import com.application.based.model.UserModel;
import com.application.based.service.RegistrationServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
public class RegistrationController {

    @Autowired
    private RegistrationServiceImpl registrationServiceImpl;

    @Autowired
    private ApplicationEventPublisher publisher;

    private String applicationUrl(HttpServletRequest request){
        return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    }

    @PostMapping("/register/user")
    public String registerUser(@RequestBody UserModel userModel, final HttpServletRequest request){
        if(!userModel.getPassword().equals(userModel.getMatchingPassword())){
            return "Please enter matching passwords. Registration aborted.";
        }

        User user = registrationServiceImpl.registerUser(userModel);
        publisher.publishEvent(new RegistrationCompleteEvent(user, applicationUrl(request)));

        return "Registration Successful. Email sent for verification to registered email id.";
    }

    @GetMapping("/verifyRegistration")
    public ResponseEntity<Void> verifyRegistration(@RequestParam("token") String token) {
        String result = registrationServiceImpl.validateVerificationToken(token);

        String redirectUrl;
        if (result.equalsIgnoreCase("valid")) {
            redirectUrl = "http://localhost:5173/verify?status=success";
        } else {
            redirectUrl = "http://localhost:5173/verify?status=failure";
        }

        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
    }



}
