package com.example.REM_Backend.Service;

import com.example.REM_Backend.Dto.UpdateRequestDto;
import com.example.REM_Backend.Dto.UserDto;
import com.example.REM_Backend.Entity.User;
import com.example.REM_Backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final AsyncCloudinaryUpload asyncCloudinaryUpload;

    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return userRepository.findFirstByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
            }
        };
    }

    public UserDto getUserById(Long id){

        Optional<User> opUser=userRepository.findById(id);
        if(opUser.isPresent()){
            return opUser.get().getUserDto();
        }
        throw new UsernameNotFoundException("User Does not Exist");
    }


    public UserDto updateUser(Long userId,UpdateRequestDto updateRequestDto,MultipartFile profileImage){

        Optional<User> opUser=userRepository.findById(userId);
        if(opUser.isPresent()){
            User updatedUser=opUser.get();
            updatedUser.setUsername(updateRequestDto.getUsername());
            updatedUser.setEmail(updateRequestDto.getEmail());
            updatedUser.setContactNumber(updateRequestDto.getContactNumber());

            if(profileImage==null){
                System.out.println("Inside if statement");
                userRepository.save(updatedUser);
                return updatedUser.getUserDto();
            }

            byte[] imageByteArray=null;
            String fileName=null;
            try{
                imageByteArray=profileImage.getBytes();
                fileName=profileImage.getOriginalFilename();
            }catch(NullPointerException | IOException e) {
                throw new RuntimeException("Image Byte Array conversion failed");
            }

            asyncCloudinaryUpload.uploadUserImageAsync(updatedUser.getId(),imageByteArray,fileName);
            userRepository.save(updatedUser);

            return updatedUser.getUserDto();
        }

        throw new UsernameNotFoundException("User does not exist!!");

    }


}
