package com.application.based.service;

import com.application.based.model.EmailModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import static com.application.based.util.PrivacyUtil.maskEmail;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Override
    public String sendSimpleMail(EmailModel emailModel) {
        String loggedRecipient = maskEmail(emailModel.getRecipient());
        log.info("Preparing to send email - Subject: {}, To: {}",
                 emailModel.getSubject(), loggedRecipient);
        log.trace("Email content preview: {}...",
                  emailModel.getMsgBody().substring(0, Math.min(20, emailModel.getMsgBody().length())));

        try {
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom(sender);
            simpleMailMessage.setSubject(emailModel.getSubject());
            simpleMailMessage.setTo(emailModel.getRecipient());
            simpleMailMessage.setText(emailModel.getMsgBody());

            javaMailSender.send(simpleMailMessage);
            log.info("Email successfully sent to {}", loggedRecipient);
            return "Mail Sent Successfully.";
        } catch (Exception e) {
            log.error("Failed to send email to {} - Error: {}", loggedRecipient, e.getMessage());
            log.debug("Full error stack:", e);
            return "Error while sending mail.";
        }
    }
}