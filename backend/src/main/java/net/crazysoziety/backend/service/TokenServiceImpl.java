package net.crazysoziety.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import net.crazysoziety.backend.model.User;
import org.springframework.stereotype.Service;

import java.security.Key;

@Service
public class TokenServiceImpl implements TokenService {

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(User user) {
        return Jwts
                .builder()
                .setSubject(user.getAlias())
                .signWith(key)
                .compact();
    }

    public String extractAlias(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
