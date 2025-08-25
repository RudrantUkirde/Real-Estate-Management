package com.example.REM_Backend.Dto;

import lombok.Data;

@Data
public class SignUpDto {

    private String username;

    private String email;

    private String password;

    private String confirmPassword;
}
