package com.application.based.service;

import com.application.based.entity.BlacklistedJWTToken;
import com.application.based.repository.BlacklistedJWTTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Slf4j
@Service
public class BlacklistedJWTTokenServiceImpl implements BlacklistedJWTTokenService {

    @Autowired
    private BlacklistedJWTTokenRepository blacklistedJWTTokenRepository;

    @Override
    public BlacklistedJWTToken createExpirationToken(String token, Date expiry) {
        log.info("Blacklisting JWT token - Expires at: {}", expiry);
        log.trace("Token being blacklisted (first 1000 chars because privacy does not matter when testing): {}...",
                  token.substring(0, Math.min(1000, token.length())));

        BlacklistedJWTToken expiredToken = BlacklistedJWTToken.builder()
                .expiryDate(expiry)
                .token(token)
                .build();

        BlacklistedJWTToken savedToken = blacklistedJWTTokenRepository.save(expiredToken);

        // Modified logging to not depend on getId()
        log.debug("Successfully blacklisted token - Expiry: {}", savedToken.getExpiryDate());
        return savedToken;
    }
}