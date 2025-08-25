package com.example.REM_Backend.Controller;


import com.example.REM_Backend.Dto.UpdateRequestDto;
import com.example.REM_Backend.Dto.UserDto;
import com.example.REM_Backend.Repository.UserRepository;
import com.example.REM_Backend.Service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId){
        try{
            UserDto user=userService.getUserById(userId);
            return ResponseEntity.ok().body(user);
        }catch(UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found");
        }
    }

    @PutMapping(value = "/update/{userId}",consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUser(@PathVariable Long userId,
                                        @RequestPart("user")String userJson,
                                        @RequestPart(value = "profileImage",required = false)MultipartFile profileImage) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        UpdateRequestDto updateRequestDto = mapper.readValue(userJson, UpdateRequestDto.class);
        try {
            UserDto updatedUser=userService.updateUser(userId,updateRequestDto,profileImage);
            return ResponseEntity.ok(updatedUser);
        }catch(UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!!");
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Profile update failed");
        }

    }
}
