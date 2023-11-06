package net.crazysoziety.backend.controller;

import net.crazysoziety.backend.model.User;
import net.crazysoziety.backend.service.LocationServiceImpl;
import net.crazysoziety.backend.service.UserServiceImpl;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user")
public class LocationController {

    private final UserServiceImpl userService;
    private final LocationServiceImpl locationService;

    public LocationController(LocationServiceImpl locationService, UserServiceImpl userService) {
        this.locationService = locationService;
        this.userService = userService;
    }

    @PostMapping("/update-location")
    public String updateLocation(@RequestBody LocationRequest locationRequest) {
            User user = userService.findByAlias(locationRequest.getUserAlias());
            locationService.updateLocation(user, locationRequest);
            locationService.updateGeom(user, locationRequest.getLatitude(), locationRequest.getLongitude());
            return "Location updated successfully";
    }

    @PostMapping("/search")
    public List<User> getNearbyUser(@RequestBody LocationRequest locationRequest) {
        return locationService.findNearbyUsers(locationRequest.getLatitude(), locationRequest.getLongitude())
                .stream().toList();
    }
}
