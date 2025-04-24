package com.application.based.service;

import com.application.based.model.InvitationCodeDto;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class InvitationCodeServiceImpl implements InvitationCodeService {
    private static final Map<String, String> VALID_CODES = Map.of(
            "admin123", "ROLE_ADMIN",
            "employee456", "ROLE_EMPLOYEE"
    );

    @Override
    public boolean isValid(String code) {
        if (code == null || code.trim().isEmpty()) {
            return false;
        }
        // Normalize the input (trim + lowercase)
        String normalizedCode = code.trim().toLowerCase();
        return VALID_CODES.containsKey(normalizedCode);
    }

    @Override
    public String getRoleForCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return "ROLE_CUSTOMER";
        }
        String normalizedCode = code.trim().toLowerCase();
        return VALID_CODES.getOrDefault(normalizedCode, "ROLE_CUSTOMER");
    }

    @Override
    public String generateCode(InvitationCodeDto invitationCodeDto) {
        return "Use predefined codes: ADMIN123 (Admin) or EMPLOYEE456 (Employee)";
    }
}