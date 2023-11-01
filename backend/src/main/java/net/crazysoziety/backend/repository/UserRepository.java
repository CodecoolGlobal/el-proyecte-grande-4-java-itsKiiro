package net.crazysoziety.backend.repository;

import net.crazysoziety.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByAlias(String alias);
}
