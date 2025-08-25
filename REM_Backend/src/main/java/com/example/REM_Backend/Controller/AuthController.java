package com.example.REM_Backend.Controller;

import com.example.REM_Backend.Dto.*;
import com.example.REM_Backend.Entity.Property;
import com.example.REM_Backend.Repository.UserRepository;
import com.example.REM_Backend.Service.AuthService;
import com.example.REM_Backend.Service.PropertyService;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    private final PropertyService propertyService;


    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpDto signUpDto){

        if(authService.verifyUserWithEmail(signUpDto.getEmail())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("User Already Exist with this email");
        }
        if(!signUpDto.getPassword().equals(signUpDto.getConfirmPassword())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password mis-match");
        }

        UserDto createdUserDto=authService.signupUser(signUpDto);

        if(createdUserDto == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User Not Created");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(createdUserDto);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDto verifyUserDto){
        try {
            authService.verifyUser(verifyUserDto);
            System.out.println("Account Verified successfully!!");
            return ResponseEntity.ok().build();
        } catch(EntityExistsException e){
            return ResponseEntity.status(HttpStatus.FOUND).body("Already Verified Account!!");
        }catch(VerifyError e){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Verification code has expired");
        }catch(UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found.");
        }catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Invalid verification code");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto){
        try{
            LoginResponseDto response=authService.login(loginRequestDto);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
        }catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found,Please register");
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Account not verified. Please verify your account.");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Incorrect Username or Password");
        }
    }

    @PostMapping("/resendCode")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authService.resendVerificationCode(email);
            System.out.println("Verification Code Resend success");
            return ResponseEntity.ok().build();
        } catch(EntityExistsException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Account Already verified");
        }catch (UsernameNotFoundException e) {
            return ResponseEntity.badRequest().body("User Not Found, please signup first!!");
        }
    }

    @GetMapping("/getAllProperties")
    public Page<PropertyResponseDto> getAllProperties(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "8") int size){
        return propertyService.getAllProperties(PageRequest.of(page, size));
    }


}
