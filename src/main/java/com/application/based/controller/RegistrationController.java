package com.application.based.controller;

import com.application.based.entity.User;
import com.application.based.entity.VerificationToken;
import com.application.based.event.RegistrationCompleteEvent;
import com.application.based.model.EmailModel;
import com.application.based.model.PasswordModel;
import com.application.based.model.UserModel;
import com.application.based.service.EmailService;
import com.application.based.service.RegistrationService;
import com.application.based.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Optional;
import java.util.UUID;

@RestController
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    private String applicationUrl(HttpServletRequest request){
        return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    }

    @PostMapping("/register/user")
    public String registerUser(@RequestBody UserModel userModel, final HttpServletRequest request){
        if(!userModel.getPassword().equals(userModel.getMatchingPassword())){
            return "Please enter matching passwords. Registration aborted.";
        }

        User user = registrationService.registerUser(userModel);
        publisher.publishEvent(new RegistrationCompleteEvent(user, applicationUrl(request)));

        return "Registration Successful. Email sent for verification to registered email id.";
    }

    @GetMapping("/verifyRegistration")
    public ResponseEntity<Void> verifyRegistration(@RequestParam("token") String token) {
        String result = registrationService.validateVerificationToken(token);

        String redirectUrl;
        if (result.equalsIgnoreCase("valid")) {
            redirectUrl = "http://localhost:5173/verify?status=success";
        } else {
            redirectUrl = "http://localhost:5173/verify?status=failure";
        }

        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
    }

    @GetMapping("/resendVerifyToken")
    public String resendVerificationToken(@RequestParam("token") String oldToken, final HttpServletRequest request){
        VerificationToken verificationToken = registrationService.generateNewVerificationToken(oldToken);
        User user = verificationToken.getUser();
        resendVerificationTokenMail(user, applicationUrl(request), verificationToken);
        return "Verification Link resent";
    }

    public void resendVerificationTokenMail(User user, String applicationUrl, VerificationToken verificationToken){
        String url = applicationUrl + "/verifyRegistration?token=" + verificationToken.getToken();

        EmailModel emailModel = EmailModel.builder()
                .recipient(user.getEmail())
                .subject("Account Verification")
                .msgBody("Click the link to verify your account:, {" + url + "}")
                .build();

        emailService.sendSimpleMail(emailModel);
    }

    @PostMapping("/user/resetPassword")
    public String resetPassword(@RequestBody PasswordModel passwordModel, final HttpServletRequest request){
        String userEmail = passwordModel.getEmail();
        User user = userService.getUserByEmailId(userEmail);
        String url = "";
        if(user != null){
            String token = UUID.randomUUID().toString();
            userService.createPasswordResetTokenForUser(user, token);
            url = passwordResetTokenMail(user, applicationUrl(request), token);
        }

        return url;
    }

    @PostMapping("/user/savePassword")
    public String savePassword(@RequestParam("token") String token, @RequestBody PasswordModel passwordModel){
        String result = userService.validatePasswordResetToken(token);
        if(!result.equalsIgnoreCase("valid")){
            return "Invalid or expired token";
        }
        Optional<User> user = userService.getUserByPasswordResetToken(token);
        if(user.isPresent()){
            userService.changePassword(user.get(), passwordModel.getNewPassword());
            return "Password reset successfully";
        }
        else{
            return "Invalid token";
        }
    }

    public String passwordResetTokenMail(User user, String applicationUrl, String passwordResetToken){
        String url = applicationUrl + "/user/savePassword?token=" + passwordResetToken;

        EmailModel emailModel = EmailModel.builder()
                .recipient(user.getEmail())
                .subject("Password Reset Mail")
                .msgBody("Click the link to reset your password: {" + url + "}")
                .build();

        emailService.sendSimpleMail(emailModel);

        return url;
    }

    @PostMapping("/user/changePassword")
    public String changePassword(@RequestBody PasswordModel passwordModel){
        User user = userService.getUserByEmailId(passwordModel.getEmail());
        if(!userService.checkIfValidOldPassword(user, passwordModel.getOldPassword())){
            return "Invalid Old Password";
        }

        String newPassword = passwordModel.getNewPassword();
        userService.changePassword(user, newPassword);
        return "Password Changed Successfully";
    }
}
