package net.crazysoziety.backend.service;

import net.crazysoziety.backend.controller.FavoriteRequest;
import net.crazysoziety.backend.model.User;
import net.crazysoziety.backend.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class FavoriteServiceImpl implements FavoriteService {

    private final UserServiceImpl userService;
    private final UserRepository userRepository;

    public FavoriteServiceImpl(UserServiceImpl userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @Override
    public String addFavorite(FavoriteRequest favoriteRequest) {
        User user = userService.findByAlias(favoriteRequest.userAlias());

        User userToAdd = userService.findByAlias(favoriteRequest.favoriteAlias());
        user.getFavorites().add(userToAdd);
        userService.saveUser(user);

        return "User added successfully";
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
    public String deleteFavorite(FavoriteRequest favoriteRequest) {
        User user = userService.findByAlias(favoriteRequest.userAlias());
        User userToDelete = userService.findByAlias(favoriteRequest.favoriteAlias());
        user.getFavorites().remove(userToDelete);
        userService.saveUser(user);
        return "Favorite deleted successfully";
    }

}
