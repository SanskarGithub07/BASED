package com.application.based.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtService {

    @Value("${app.jwt.secret}")
    public String SECRET;

    public String generateToken(String usernameOrEmail, String loginType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("loginType", loginType);
        return createToken(claims, usernameOrEmail);
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
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String usernameFromToken = extractUsername(token);
        final String loginType = extractClaim(token, claims -> claims.get("loginType").toString());

        if (loginType.equals("email") && userDetails instanceof UserInfoDetails) {
            return usernameFromToken.equals(((UserInfoDetails) userDetails).getEmail()) && !isTokenExpired(token);
        } else if (loginType.equals("username") && userDetails instanceof UserInfoDetails) {
            return usernameFromToken.equals(((UserInfoDetails) userDetails).getUsernameOnly()) && !isTokenExpired(token);
        }

        return false;
    }
}

