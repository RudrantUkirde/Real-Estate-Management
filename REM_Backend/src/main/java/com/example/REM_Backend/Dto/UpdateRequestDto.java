package com.example.REM_Backend.Dto;


import com.example.REM_Backend.Enums.UserRole;
import lombok.Data;

@Data
public class UpdateRequestDto {

    private String username;

    private String email;

    private String contactNumber;

}
