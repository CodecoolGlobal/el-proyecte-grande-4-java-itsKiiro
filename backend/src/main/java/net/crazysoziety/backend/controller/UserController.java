package net.crazysoziety.backend.controller;

import net.crazysoziety.backend.model.FavoriteRequest;
import net.crazysoziety.backend.model.FriendRequest;
import net.crazysoziety.backend.model.LocationRequest;
import net.crazysoziety.backend.model.User;
import net.crazysoziety.backend.service.TokenServiceImpl;
import net.crazysoziety.backend.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private TokenServiceImpl tokenService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody User user) {
        try {
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);
            userService.saveUser(user);
            return ResponseEntity.ok("User saved");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User foundUser = userService.findByAlias(user.getAlias());

            if (foundUser == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                return ResponseEntity.badRequest().body("Incorrect password");
            }

            String token = tokenService.generateToken(foundUser);
            return ResponseEntity.ok(token);
        } catch(Exception e) {
            return ResponseEntity.badRequest().body("Error:" + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String cleanedToken = token.replace("\"", "");
            String userAlias = tokenService.extractAlias(cleanedToken);
            User user = userService.findByAlias(userAlias);
            User userDTO = new User();
            userDTO.setAlias(user.getAlias());
            userDTO.setEmail(user.getEmail());
            userDTO.setName(user.getName());
            userDTO.setId(user.getId());
            userDTO.setBirthdate(user.getBirthdate());
            userDTO.setProfilePicture(user.getProfilePicture());

            return ResponseEntity.ok(userDTO);
        } catch(Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/upload/{alias}")
    public ResponseEntity<?> uploadFile(@RequestParam("profilePicture") MultipartFile file, @PathVariable String alias) {
        try {
            byte[] imageBytes = file.getBytes();

            User foundUser = userService.findByAlias(alias);
            foundUser.setProfilePicture(imageBytes);
            userService.saveUser(foundUser);

            return ResponseEntity.ok("picture uploaded.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error while uploading picture: " + e.getMessage());
        }
    }

    @PostMapping("/update-location")
    public ResponseEntity<?> updateLocation(@RequestBody LocationRequest locationRequest) {
        try {
            User user = userService.findByAlias(locationRequest.getUserAlias());
            if(user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            user.setLatitude(locationRequest.getLatitude());
            user.setLongitude(locationRequest.getLongitude());
            userService.saveUser(user);

            return ResponseEntity.ok("Location updated successfully");
        } catch(Exception e) {
            return ResponseEntity.badRequest().body("Error updating location: " + e.getMessage());
        }
    }

    @PostMapping("/search")
    public List<User> getNearbyUser(@RequestBody LocationRequest locationRequest) {

        return userService.findNearbyUsers(locationRequest.getLatitude(), locationRequest.getLongitude())
                .stream().filter(user -> !user.getAlias().equals(locationRequest.getUserAlias()))
                .collect(Collectors.toList());
    }

    @PostMapping("/friend/add")
    public ResponseEntity<?> addFriend(@RequestBody FriendRequest friendRequest) {
        try {
            User user = userService.findByAlias(friendRequest.userAlias());
            if(user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            user.getAddedUsers().add(friendRequest.userToAdd());
            userService.saveUser(user);

            return ResponseEntity.ok("User added successfully");
        } catch(Exception e) {
            return ResponseEntity.badRequest().body("Error adding user: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/addedUsers")
    public ResponseEntity<List<User>> getAddedUsers(@PathVariable int id) {
        List<User> addedUsers = userService.getAddedUsersByUserId(id);
        return ResponseEntity.ok(addedUsers);
    }

    @PostMapping("/add/favorites")
    public ResponseEntity<?> addFavorite(@RequestBody FavoriteRequest favoriteRequest) {
        try {
            User user = userService.findByAlias(favoriteRequest.userAlias());
            if(user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User userToAdd = userService.findByAlias(favoriteRequest.favoriteAlias());
            user.getFavorites().add(userToAdd);
            userService.saveUser(user);

            return ResponseEntity.ok("User added successfully");
        } catch(Exception e) {
            return ResponseEntity.badRequest().body("Error adding user: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/favorites")
    public ResponseEntity<List<User>> getFavorites(@PathVariable int id) {
        List<User> favUsers = userService.getFavUsersByUserId(id);
        return ResponseEntity.ok(favUsers);
    }

    @PatchMapping("/update/profile/{alias}")
    public ResponseEntity<?> updateUser(@RequestBody User updateInfo,@PathVariable String alias) {
        try {
            User user = userService.findByAlias(alias);
            if(user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            user.setName(updateInfo.getName());
            user.setPassword(updateInfo.getPassword());
            user.setEmail(updateInfo.getEmail());
            user.setAlias(updateInfo.getAlias());
            userService.saveUser(user);

            return ResponseEntity.ok("User updated successfully");
        } catch(Exception e) {
            return ResponseEntity.badRequest().body("Error updating user: " + e.getMessage());
        }
    }

    @GetMapping("/{alias}/profilePicture")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable String alias) {
        User user = userService.findByAlias(alias);
        if (user != null && user.getProfilePicture() != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                    .body(user.getProfilePicture());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/favorite")
    public ResponseEntity<?> deleteFavorite(@RequestBody FavoriteRequest favoriteRequest) {
        User user = userService.findByAlias(favoriteRequest.userAlias());
        User userToDelete = userService.findByAlias(favoriteRequest.favoriteAlias());
        user.getFavorites().remove(userToDelete);
        userService.saveUser(user);
        return ResponseEntity.ok("User updated successfully");

    }

}

