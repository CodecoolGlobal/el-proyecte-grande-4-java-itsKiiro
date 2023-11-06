package net.crazysoziety.backend.controller;

import net.crazysoziety.backend.model.User;
import net.crazysoziety.backend.model.UserDTO;
import net.crazysoziety.backend.service.UserServiceImpl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserServiceImpl userService;

    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }


    @PostMapping("/sign-up")
    public String signUp(@RequestBody User user) {
            userService.createNewUser(user);
            return "User saved!";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
            return userService.checkLogin(user);
    }

    @GetMapping("/profile")
    public UserDTO getProfile(@RequestHeader("Authorization") String authHeader) {
            return userService.getProfile(authHeader);
    }

    @PostMapping("/upload/{alias}")
    public String uploadFile(@RequestParam("profilePicture") MultipartFile file, @PathVariable String alias) throws IOException {
        return userService.uploadProfilePicture(file, alias);
    }

    @PostMapping("/friend/add")
    public String addFriend(@RequestBody FriendRequest friendRequest) {
        return userService.addFriend(friendRequest);
    }

    @GetMapping("/{id}/addedUsers")
    public List<User> getAddedUsers(@PathVariable int id) {
        return userService.getAddedUsersByUserId(id);
    }

    @PatchMapping("/update/profile/{alias}")
    public String updateUser(@RequestBody User updateInfo,@PathVariable String alias) {
            return userService.updateUser(updateInfo, alias);
    }

    @GetMapping("/{alias}/profilePicture")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable String alias) {
        User user = userService.findByAlias(alias);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                .body(user.getProfilePicture());
    }

}

