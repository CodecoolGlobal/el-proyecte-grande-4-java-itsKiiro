package net.crazysoziety.backend.model;

import java.time.LocalDate;

public class UserDTO {

    private String alias;
    private int id;
    private String email;
    private String name;
    private byte[] profilePicture;
    private LocalDate birthdate;

    public UserDTO(String alias, int id, String email, String name, byte[] profilePicture, LocalDate birthdate) {
        this.alias = alias;
        this.id = id;
        this.email = email;
        this.name = name;
        this.profilePicture = profilePicture;
        this.birthdate = birthdate;
    }
}
