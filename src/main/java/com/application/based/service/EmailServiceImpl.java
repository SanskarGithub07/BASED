package com.application.based.service;

import com.application.based.model.EmailModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService{

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Override
    public String sendSimpleMail(EmailModel emailModel){
        try{
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();

            simpleMailMessage.setFrom(sender);
            simpleMailMessage.setSubject(emailModel.getSubject());
            simpleMailMessage.setTo(emailModel.getRecipient());
            simpleMailMessage.setText(emailModel.getMsgBody());

            javaMailSender.send(simpleMailMessage);
            return "Mail Sent Successfully.";
        }
        catch(Exception e){
            return "Error while sending mail.";
        }
    }
}
