package net.crazysoziety.backend.service;

import net.crazysoziety.backend.controller.FriendRequest;
import net.crazysoziety.backend.model.User;
import net.crazysoziety.backend.model.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {
    User saveUser(User user);
    User findByAlias(String alias);
    List<User> getAddedUsersByUserId(int userId);
    void createNewUser(User user);
    String checkLogin(User user);
    UserDTO getProfile(String authHeader);
    String uploadProfilePicture(MultipartFile file, String alias) throws IOException;
    String updateUser(User updateInfo, String alias);
    String addFriend(FriendRequest friendRequest);
}
