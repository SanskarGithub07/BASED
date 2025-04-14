package com.application.based.controller;

import com.application.based.entity.User;
import com.application.based.entity.VerificationToken;
import com.application.based.event.RegistrationCompleteEvent;
import com.application.based.model.*;
import com.application.based.service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @Autowired
    private BlacklistedJWTTokenService blacklistedJWTTokenService;

    private String applicationUrl(HttpServletRequest request){
        return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterModel registerModel, final HttpServletRequest request){
        if(!registerModel.getPassword().equals(registerModel.getMatchingPassword())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please enter matching passwords. Registration aborted.");
        }

        User user = registrationService.registerUser(registerModel);
        publisher.publishEvent(new RegistrationCompleteEvent(user, applicationUrl(request)));

        return ResponseEntity.ok("Registration Successful. Email sent for verification to registered email id.");
    }

    @PostMapping("/login")
    public JwtAuthResponseModel authenticateAndGetToken(@RequestBody LoginModel loginModel) {
        String input = loginModel.getUsernameOrEmail();
        String loginType = input.contains("@") ? "email" : "username";

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginModel.getUsernameOrEmail(), loginModel.getPassword())
        );

        System.out.println(authentication.toString());
        if (authentication.isAuthenticated()) {
            UserInfoDetails userInfoDetails = (UserInfoDetails) authentication.getPrincipal();
            System.out.println(userInfoDetails.getUsername());
            System.out.println(loginType);
            String token = jwtService.generateToken(userInfoDetails.getUsername(), loginType);
            System.out.println(token);
            JwtAuthResponseModel jwtAuthResponseModel = JwtAuthResponseModel
                    .builder()
                    .accessToken(token)
                    .tokenType("Bearer")
                    .build();
            return jwtAuthResponseModel;
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        if(authHeader != null && authHeader.startsWith("Bearer ")){
            String token = authHeader.substring(7);
            Date expiry = jwtService.extractExpiration(token);

            blacklistedJWTTokenService.createExpirationToken(token, expiry);
            return ResponseEntity.ok("Logged out successfully");
        }

        return ResponseEntity.badRequest().body("Token is missing");
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

    @PostMapping("/resetPassword")
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

    @PostMapping("/savePassword")
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

    @PostMapping("/changePassword")
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
