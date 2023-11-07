package net.crazysoziety.backend.service;

import jakarta.transaction.Transactional;
import net.crazysoziety.backend.controller.FriendRequest;
import net.crazysoziety.backend.model.User;
import net.crazysoziety.backend.model.UserDTO;
import net.crazysoziety.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TokenServiceImpl tokenService;

    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, TokenServiceImpl tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

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
    public List<User> getAddedUsersByUserId(int userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            return user.get().getAddedUsers();
        } else {
            return new ArrayList<>();
        }
    }

    @Override
    public void createNewUser(User user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        saveUser(user);
    }

    @Override
    public String checkLogin(User user) {
        User foundUser = findByAlias(user.getAlias());

        if (foundUser == null) {
            return "User not found";
        }

        if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            return "Incorrect password";
        }
        return tokenService.generateToken(foundUser);
    }

    @Override
    public UserDTO getProfile(String authHeader) {
        String token = authHeader.substring(7);
        String cleanedToken = token.replace("\"", "");
        String userAlias = tokenService.extractAlias(cleanedToken);
        User user = findByAlias(userAlias);
        return new UserDTO(
                user.getAlias(),
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getProfilePicture(),
                user.getBirthdate());
    }

    @Override
    public String uploadProfilePicture(MultipartFile file, String alias) throws IOException {
        byte[] imageBytes = file.getBytes();

        User foundUser = findByAlias(alias);
        foundUser.setProfilePicture(imageBytes);
        saveUser(foundUser);

        return "picture uploaded.";
    }

    @Override
    public String updateUser(User updateInfo, String alias) {
        User user = findByAlias(alias);

        user.setName(updateInfo.getName());
        user.setPassword(updateInfo.getPassword());
        user.setEmail(updateInfo.getEmail());
        user.setAlias(updateInfo.getAlias());
        saveUser(user);
        return "User updated";
    }

    @Override
    public String addFriend(FriendRequest friendRequest) {
        User user = findByAlias(friendRequest.userAlias());
        user.getAddedUsers().add(friendRequest.userToAdd());
        saveUser(user);

        return "User added successfully";
    }
}
