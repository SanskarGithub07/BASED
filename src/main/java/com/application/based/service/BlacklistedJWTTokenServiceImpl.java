package com.application.based.service;

import com.application.based.entity.BlacklistedJWTToken;
import com.application.based.repository.BlacklistedJWTTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class BlacklistedJWTTokenServiceImpl implements BlacklistedJWTTokenService{

    @Autowired
    private BlacklistedJWTTokenRepository blacklistedJWTTokenRepository;

    @Override
    public BlacklistedJWTToken createExpirationToken(String token, Date expiry) {
        BlacklistedJWTToken expiredToken = BlacklistedJWTToken.builder()
                .expiryDate(expiry)
                .token(token)
                .build();

        return blacklistedJWTTokenRepository.save(expiredToken);
    }
}
