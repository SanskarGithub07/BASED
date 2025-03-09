package com.application.based.event.listener;

import com.application.based.entity.User;
import com.application.based.event.RegistrationCompleteEvent;
import com.application.based.model.EmailModel;
import com.application.based.service.EmailServiceImpl;
import com.application.based.service.RegistrationServiceImpl;
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
    private RegistrationServiceImpl registrationServiceImpl;

    @Autowired
    private EmailServiceImpl emailServiceImpl;

    @Override
    public void onApplicationEvent(RegistrationCompleteEvent event){
        User user = event.getUser();
        String token = UUID.randomUUID().toString();

        registrationServiceImpl.saveVerificationTokenForUser(token, user);

        String url = event.getApplicationUrl() + "/verifyRegistration?token=" + token;

        EmailModel emailModel = EmailModel.builder()
                .recipient(user.getEmail())
                .subject("Account Verification")
                .msgBody("Click the link to verify your account:, {" + url + "}")
                .build();

        emailServiceImpl.sendSimpleMail(emailModel);
    }
}

