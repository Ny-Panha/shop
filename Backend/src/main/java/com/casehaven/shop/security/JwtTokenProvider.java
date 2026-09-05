package com.casehaven.shop.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long validityInMilliseconds;

    public JwtTokenProvider(
            @Value("${jwt.secret:casehaven_super_secret_jwt_key_cambodia_shop_2026_secure_key_1234567890}") String secret,
            @Value("${jwt.expiration.ms:604800000}") long validityInMilliseconds) { // 7 days default
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.validityInMilliseconds = validityInMilliseconds;
    }

    public String createToken(String email, String role) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(validity)
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public String getEmail(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String getRole(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
