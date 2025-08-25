package com.example.REM_Backend.Dto;

import com.example.REM_Backend.Enums.PropertyType;
import com.example.REM_Backend.Enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyRequestDto {

    private String title;
    private String description;
    private Double latitude;
    private Double longitude;
    private PropertyType propertyType;
    private TransactionType transactionType;
    private String address;
    private Double price;
    private List<String> features;

}
