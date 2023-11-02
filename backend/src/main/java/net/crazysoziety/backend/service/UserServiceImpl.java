package net.crazysoziety.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import net.crazysoziety.backend.model.User;
import net.crazysoziety.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager entityManager;

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
        double distanceInMeters = 10;
        return userRepository.findNearbyUsers(latitude, longitude, distanceInMeters);
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

    @Override
    @Transactional
    public void updateGeom(User user, double latitude, double longitude) {
        String sql = "UPDATE users SET geom = ST_SetSRID(ST_Point(:longitude, :latitude), 4326) WHERE id = :userId";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("latitude", latitude);
        query.setParameter("longitude", longitude);
        query.setParameter("userId", user.getId());
        query.executeUpdate();
    }
}
