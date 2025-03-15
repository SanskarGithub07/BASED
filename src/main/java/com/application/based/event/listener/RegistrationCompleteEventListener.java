package com.application.based.event.listener;

import com.application.based.entity.User;
import com.application.based.event.RegistrationCompleteEvent;
import com.application.based.model.EmailModel;
import com.application.based.service.EmailService;
import com.application.based.service.RegistrationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j
public class RegistrationCompleteEventListener implements
        ApplicationListener<RegistrationCompleteEvent> {
    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private EmailService emailService;

    @Override
    public void onApplicationEvent(RegistrationCompleteEvent event){
        User user = event.getUser();
        String token = UUID.randomUUID().toString();

        registrationService.saveVerificationTokenForUser(token, user);

        String url = event.getApplicationUrl() + "/verifyRegistration?token=" + token;

        EmailModel emailModel = EmailModel.builder()
                .recipient(user.getEmail())
                .subject("Account Verification")
                .msgBody("Click the link to verify your account:, {" + url + "}")
                .build();

        emailService.sendSimpleMail(emailModel);
    }
}

