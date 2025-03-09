package com.application.based.service;

import com.application.based.model.EmailModel;

public interface EmailService {
    public String sendSimpleMail(EmailModel emailModel);
}
