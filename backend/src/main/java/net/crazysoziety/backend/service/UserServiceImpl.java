package net.crazysoziety.backend.service;

import jakarta.transaction.Transactional;
import net.crazysoziety.backend.model.User;
import net.crazysoziety.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User findByAlias(String alias) {
        return userRepository.findByAlias(alias).orElse(null);
    }

    @Override
    public List<User> findNearbyUsers(double latitude, double longitude) {
        List<User> allUsers = userRepository.findAll();

        return allUsers.stream()
                .filter(user -> isNearby(user.getLatitude(), user.getLongitude(), latitude, longitude))
                .collect(Collectors.toList());
    }

    private boolean isNearby(double lat1, double lon1, double lat2, double lon2) {
        double distance = calculateDistance(lat1, lon1, lat2, lon2);
        return distance <= 0.01;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat/2) * Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        double distance = EARTH_RADIUS * c;

        return distance;
    }

    @Override
    public List<User> getAddedUsersByUserId(int userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            return user.get().getAddedUsers();
        } else {

            return new ArrayList<>();
        }

    }

    @Override
    public List<User> getFavUsersByUserId(int userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            return user.get().getFavorites();
        } else {

            return new ArrayList<>();
        }

    }
}
