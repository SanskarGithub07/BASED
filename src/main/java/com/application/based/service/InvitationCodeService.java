package com.application.based.service;

import com.application.based.model.InvitationCodeDto;

public interface InvitationCodeService {
    String generateCode(InvitationCodeDto invitationCodeDto);
//    boolean isValidCode(String code);

    boolean isValid (String code);

    String getRoleForCode(String code);
//    void markCodeAsUsed(String code);
//    void cleanUpExpiredCodes();
}
