// JwtAuthenticationFilter.java
package com.mpma.dms.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.*;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final String SECRET = "z8yXv9uT1sWqP0rMnBvCgEhYtUoIqJhKlZxCvBnMqWxYuIpOlKmNbVcXzAsDfGhJ";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = header.substring(7);
        try {
            String username = Jwts.parserBuilder()
                    .setSigningKey(SECRET.getBytes())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, null);

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        } catch (JwtException ex) {
            // Invalid token, do nothing or log
        }

        filterChain.doFilter(request, response);
    }
}
