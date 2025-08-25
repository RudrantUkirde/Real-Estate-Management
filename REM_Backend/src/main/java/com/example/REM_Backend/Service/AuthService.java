package com.example.REM_Backend.Service;

import com.example.REM_Backend.Dto.*;
import com.example.REM_Backend.Entity.User;
import com.example.REM_Backend.Enums.UserRole;
import com.example.REM_Backend.Repository.UserRepository;
import com.example.REM_Backend.Utils.JwtUtil;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final EmailService emailService;

    private final AuthenticationManager authenticationManager;

    private final UserService userService;

    private final JwtUtil jwtUtil;

    //SignUp User method
    public UserDto signupUser(SignUpDto signUpDto) {

        User user =new User();
        user.setUsername(signUpDto.getUsername());
        user.setEmail(signUpDto.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(signUpDto.getPassword()));
        user.setUserRole(UserRole.USER);
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        user.setContactNumber(null);
        user.setProfileImage(null);
        sendVerificationEmail(user);
        User createdUser=userRepository.save(user);
        return createdUser.getUserDto();
    }

    //Verify User after signup
    public void verifyUser(VerifyUserDto verifyUserDto){
        Optional<User> optionalUser = userRepository.findByEmail(verifyUserDto.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if(user.isEnabled()){
                throw new EntityExistsException("User already verified");
            }
            if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
                throw new VerifyError("Verification code has expired");
            }
            if (user.getVerificationCode().equals(verifyUserDto.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationCodeExpiresAt(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Invalid verification code");
            }
        } else {
            throw new UsernameNotFoundException("User not found");
        }
    }

    //Resend verification code function
    public void resendVerificationCode(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) {
                throw new EntityExistsException("Account is already verified");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
            sendVerificationEmail(user);
            userRepository.save(user);
        } else {
            throw new UsernameNotFoundException("User not found");
        }
    }

    //Login Function
    public LoginResponseDto login(LoginRequestDto loginRequestDto){

        User user=userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow( () -> new UsernameNotFoundException("User not found,Please Register!!"));

        if(!user.isEnabled()){
            throw new DisabledException("Account not verified. Please verify your account.");
        }

        try{
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDto.getEmail(),
                            loginRequestDto.getPassword()));

        }catch (BadCredentialsException e){
            throw new BadCredentialsException("Incorrect Username Password");
        }

        final UserDetails userDetails=userService.userDetailsService().loadUserByUsername(loginRequestDto.getEmail());

        Optional<User> optionalUser=userRepository.findByEmail(loginRequestDto.getEmail());

        final String jwtToken=jwtUtil.generateToken(userDetails);

        LoginResponseDto loginResponseDto=new LoginResponseDto();

        if(optionalUser.isPresent()){
            loginResponseDto.setJwt(jwtToken);
            loginResponseDto.setUserId(optionalUser.get().getId());
            loginResponseDto.setUserRole(optionalUser.get().getUserRole());
        }

        return loginResponseDto;

    }

    //User already present or not
    public Boolean verifyUserWithEmail(String email) {
        return userRepository.findFirstByEmail(email).isPresent();
    }

    //Verification email sender
    private void sendVerificationEmail(User user) { //TODO: Update with company logo
        String subject = "Account Verification";
        String verificationCode = "VERIFICATION CODE " + user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            // Handle email sending exception
            e.printStackTrace();
        }
    }

    //Generate verification code
    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }


}
