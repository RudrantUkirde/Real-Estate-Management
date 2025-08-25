package com.example.REM_Backend.Controller;


import com.example.REM_Backend.Dto.PropertyCreatedDto;
import com.example.REM_Backend.Dto.PropertyRequestDto;
import com.example.REM_Backend.Dto.PropertyResponseDto;
import com.example.REM_Backend.Dto.UpdateRequestDto;
import com.example.REM_Backend.Entity.Property;
import com.example.REM_Backend.Entity.User;
import com.example.REM_Backend.Repository.UserRepository;
import com.example.REM_Backend.Service.PropertyService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/property")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final UserRepository userRepository;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProperty(
            @RequestPart("property")String propertyJson,
            @RequestPart("images")MultipartFile[] images,
            Principal principal) throws IOException {

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        ObjectMapper mapper = new ObjectMapper();
        PropertyRequestDto propertyRequestDto = mapper.readValue(propertyJson, PropertyRequestDto.class);

        propertyService.createProperty(propertyRequestDto, images, user);

        PropertyCreatedDto propertyCreatedDto=new PropertyCreatedDto();
        propertyCreatedDto.setResponse("Property Created Successfully!!");

        return ResponseEntity.status(HttpStatus.CREATED).body(propertyCreatedDto);
    }

    @GetMapping("/{propertyId}")
    public ResponseEntity<?> getPropertyById(@PathVariable Long propertyId){
        try{
//            Property property=propertyService.getPropertyById(propertyId);
            PropertyResponseDto propertyResponseDto=propertyService.getPropertyById(propertyId);
            return ResponseEntity.ok(propertyResponseDto);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property Not found with this ID");
        }
    }


}
