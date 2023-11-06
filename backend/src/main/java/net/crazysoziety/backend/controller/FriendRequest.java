package net.crazysoziety.backend.controller;

import net.crazysoziety.backend.model.User;

public record FriendRequest(User userToAdd, String userAlias) {
}
