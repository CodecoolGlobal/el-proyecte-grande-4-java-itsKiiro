package net.crazysoziety.backend.controller;

import net.crazysoziety.backend.model.User;
import net.crazysoziety.backend.service.FavoriteServiceImpl;
import net.crazysoziety.backend.service.LocationServiceImpl;
import net.crazysoziety.backend.service.TokenServiceImpl;
import net.crazysoziety.backend.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class FavoriteController {

    private final FavoriteServiceImpl favoriteService;

    public FavoriteController(FavoriteServiceImpl favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/add/favorites")
    public String addFavorite(@RequestBody FavoriteRequest favoriteRequest) {
        return favoriteService.addFavorite(favoriteRequest);
    }

    @GetMapping("/{id}/favorites")
    public List<User> getFavorites(@PathVariable int id) {
        return favoriteService.getFavUsersByUserId(id);
    }

    @DeleteMapping("/delete/favorite")
    public String deleteFavorite(@RequestBody FavoriteRequest favoriteRequest) {
        return favoriteService.deleteFavorite(favoriteRequest);
    }
}
