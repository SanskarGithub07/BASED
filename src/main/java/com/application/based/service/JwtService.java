package com.application.based.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static com.application.based.util.PrivacyUtil.maskIdentifier;

@Slf4j
@Component
public class JwtService {

    @Value("${app.jwt.secret}")
    private String SECRET;

    public String generateToken(String usernameOrEmail, String loginType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("loginType", loginType);

        log.debug("Generating JWT token for {} using {} authentication",
                  maskIdentifier(usernameOrEmail), loginType);
        String token = createToken(claims, usernameOrEmail);
        log.trace("Generated token for {} (first 10 chars): {}...",
                  maskIdentifier(usernameOrEmail), token.substring(0, Math.min(10, token.length())));
        return token;
    }

    private String createToken(Map<String, Object> claims, String usernameOrEmail) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(usernameOrEmail)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(SECRET);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            log.error("Failed to generate JWT signing key", e);
            throw e;
        }
    }

    public String extractUsername(String token) {
        log.trace("Extracting username from JWT token");
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        log.trace("Extracting expiration from JWT token");
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            log.warn("Failed to parse JWT claims - {}", e.getMessage());
            throw e;
        }
    }

    private Boolean isTokenExpired(String token) {
        boolean expired = extractExpiration(token).before(new Date());
        if (expired) {
            log.debug("Token expired - {}", token.substring(0, 10) + "...");
        }
        return expired;
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        log.debug("Validating JWT token");

        try {
            final String usernameFromToken = extractUsername(token);
            final String loginType = extractClaim(token, claims -> claims.get("loginType").toString());

            boolean isValid = false;

            if (loginType.equals("email") && userDetails instanceof UserInfoDetails) {
                isValid = usernameFromToken.equals(((UserInfoDetails) userDetails).getEmail()) && !isTokenExpired(token);
                log.trace("Email-based token validation result: {}", isValid);
            }
            else if (loginType.equals("username") && userDetails instanceof UserInfoDetails) {
                isValid = usernameFromToken.equals(((UserInfoDetails) userDetails).getUsernameOnly()) && !isTokenExpired(token);
                log.trace("Username-based token validation result: {}", isValid);
            }

            if (!isValid) {
                log.warn("Token validation failed for {}", maskIdentifier(usernameFromToken));
            }

            return isValid;

        } catch (Exception e) {
            log.error("Token validation error - {}", e.getMessage());
            return false;
        }
    }
}