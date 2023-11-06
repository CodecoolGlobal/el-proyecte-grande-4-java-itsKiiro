package net.crazysoziety.backend.service;

import jakarta.transaction.Transactional;
import net.crazysoziety.backend.controller.LocationRequest;
import net.crazysoziety.backend.model.User;

import java.util.List;

public interface LocationService {
    @Transactional
    void updateGeom(User user, double latitude, double longitude);

    void updateLocation(User user, LocationRequest locationRequest);

    List<User> findNearbyUsers(double latitude, double longitude);
}
