package com.application.based.util;

public final class PrivacyUtil {

    private PrivacyUtil () {}

    public static String maskEmail(String email) {
        if (email == null || email.length() < 5 || !email.contains("@")) {
            return "<invalid_email>";
        }
        int atIndex = email.indexOf('@');
        String prefix = email.substring(0, Math.min(20, atIndex)); // make the min 5 for privacy, kept 20 for testing
        String domain = email.substring(atIndex);
        return prefix + "***" + domain;
    }

    public static String maskIdentifier(String identifier) {
        if (identifier == null || identifier.length() < 4) {
            return "<invalid>";
        }
        return identifier.substring(0, 3) + "***" +
                (identifier.contains("@") ? identifier.substring(identifier.indexOf('@')) : "");
    }
}
