package com.application.based.controller;

import com.application.based.entity.User;
import com.application.based.event.RegistrationCompleteEvent;
import com.application.based.model.UserModel;
import com.application.based.service.RegistrationServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.*;

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

        return "Registration Successful.";
    }

    @GetMapping("/verifyRegistration")
    public String verifyRegistration(@RequestParam("token") String token){
        String result = registrationServiceImpl.validateVerificationToken(token);
        if(result.equalsIgnoreCase("valid")){
            return "User Verified Successfully.";
        }

        return "Bad User";
    }


}
