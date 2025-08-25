package com.example.REM_Backend.Dto;

import com.example.REM_Backend.Enums.UserRole;
import lombok.Data;

@Data
public class LoginResponseDto {

    private String jwt;
    private Long userId;
    private UserRole userRole;

}
