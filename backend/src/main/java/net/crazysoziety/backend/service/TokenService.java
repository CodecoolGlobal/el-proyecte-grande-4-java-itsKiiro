package net.crazysoziety.backend.service;

import net.crazysoziety.backend.model.User;

public interface TokenService {
    String generateToken(User user);
    String extractAlias(String token);
}
