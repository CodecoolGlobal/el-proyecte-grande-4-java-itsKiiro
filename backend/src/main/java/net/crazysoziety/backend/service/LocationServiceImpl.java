package net.crazysoziety.backend.service;

import jakarta.transaction.Transactional;
import net.crazysoziety.backend.controller.LocationRequest;
import net.crazysoziety.backend.model.User;
import net.crazysoziety.backend.repository.UserRepository;

import java.util.List;

public class LocationServiceImpl implements LocationService {
    
    private final UserRepository userRepository;

    public LocationServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void updateGeom(User user, double latitude, double longitude) {
        userRepository.updateGeom(user.getId(), longitude, latitude);
        userRepository.save(user);
    }

    @Override
    public void updateLocation(User user, LocationRequest locationRequest) {
        user.setLatitude(locationRequest.getLatitude());
        user.setLongitude(locationRequest.getLongitude());
        userRepository.save(user);
    }

    @Override
    public List<User> findNearbyUsers(double latitude, double longitude) {
        double distanceInMeters = 10;
        return userRepository.findNearbyUsers(latitude, longitude, distanceInMeters);
    }
}
