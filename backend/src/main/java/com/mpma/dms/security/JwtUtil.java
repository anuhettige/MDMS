package com.mpma.dms.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class JwtUtil {

    // Must be at least 64 bytes (for HS512)
    private static final String SECRET = "z8yXv9uT1sWqP0rMnBvCgEhYtUoIqJhKlZxCvBnMqWxYuIpOlKmNbVcXzAsDfGhJ";

    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour expiry
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
    }
}
