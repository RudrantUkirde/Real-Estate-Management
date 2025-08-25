package com.example.REM_Backend.Dto;

import lombok.Data;

@Data
public class VerifyUserDto {

    private String email;
    private String verificationCode;
}
