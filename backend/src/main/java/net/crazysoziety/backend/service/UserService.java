package net.crazysoziety.backend.service;

import net.crazysoziety.backend.model.User;

import java.util.List;

public interface UserService {
    User saveUser(User user);
    User findByAlias(String alias);
    List<User> findNearbyUsers(double latitude, double longitude);
    List<User> getAddedUsersByUserId(int userId);
    List<User> getFavUsersByUserId(int userId);
}
