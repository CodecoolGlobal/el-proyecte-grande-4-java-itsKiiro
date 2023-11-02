package net.crazysoziety.backend.repository;

import net.crazysoziety.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByAlias(String alias);

    @Query(value = "SELECT * FROM users WHERE ST_DWithin(geom, ST_SetSRID(ST_Point(:longitude, :latitude), 4326), :distance)", nativeQuery = true)
    List<User> findNearbyUsers(@Param("latitude") double latitude, @Param("longitude") double longitude, @Param("distance") double distance);
}
