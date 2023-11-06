package net.crazysoziety.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import net.crazysoziety.backend.controller.LocationRequest;
import net.crazysoziety.backend.model.User;
import net.crazysoziety.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

public class LocationServiceImpl implements LocationService {

    private final EntityManager entityManager;
    private final UserRepository userRepository;

    public LocationServiceImpl(UserRepository userRepository, EntityManager entityManager) {
        this.userRepository = userRepository;
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public void updateGeom(User user, double latitude, double longitude) {
        String sql = "UPDATE users SET geom = ST_SetSRID(ST_Point(:longitude, :latitude), 4326) WHERE id = :userId";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("latitude", latitude);
        query.setParameter("longitude", longitude);
        query.setParameter("userId", user.getId());
        query.executeUpdate();
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
