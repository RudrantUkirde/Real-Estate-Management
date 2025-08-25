package com.example.REM_Backend.Dto;

import com.example.REM_Backend.Enums.UserRole;
import lombok.Builder;
import lombok.Data;

@Data
public class UserDto {

    private Long id;

    private String username;

    private String email;

    private UserRole userRole;

    private String contactNumber;

    private String profileImage;

}
