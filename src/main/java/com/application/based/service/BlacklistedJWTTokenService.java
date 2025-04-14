package com.application.based.service;

import com.application.based.entity.BlacklistedJWTToken;

import java.util.Date;

public interface BlacklistedJWTTokenService {
    BlacklistedJWTToken createExpirationToken(String token, Date expiry);
}
