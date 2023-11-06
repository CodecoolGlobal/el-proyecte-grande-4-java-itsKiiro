package net.crazysoziety.backend.service;

import net.crazysoziety.backend.controller.FavoriteRequest;
import net.crazysoziety.backend.model.User;

import java.util.List;

public interface FavoriteService {
    String addFavorite(FavoriteRequest favoriteRequest);

    List<User> getFavUsersByUserId(int userId);

    String deleteFavorite(FavoriteRequest favoriteRequest);
}
