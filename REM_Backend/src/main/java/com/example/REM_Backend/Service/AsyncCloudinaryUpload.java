package com.example.REM_Backend.Service;

import com.example.REM_Backend.Entity.Property;
import com.example.REM_Backend.Entity.PropertyImage;
import com.example.REM_Backend.Entity.User;
import com.example.REM_Backend.Repository.PropertiesRepository;
import com.example.REM_Backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AsyncCloudinaryUpload {

    private final CloudinaryService cloudinaryService;
    private final PropertiesRepository propertiesRepository;
    private final UserRepository userRepository;

    @Async
    public void uploadPropertyImagesAsync(Long propertyId, List<byte[]> imageBytesList, List<String> filenames) {
        Property existingProperty = propertiesRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        List<String> imageUrls = new ArrayList<>();
        for (int i = 0; i < imageBytesList.size(); i++) {
            try {
                String url = cloudinaryService.uploadFile(imageBytesList.get(i), filenames.get(i));
                imageUrls.add(url);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload to Cloudinary", e);
            }
        }

//      existingProperty.setImageUrls(imageUrls);

        // Map URLs -> PropertyImage children
        List<PropertyImage> imageEntities = imageUrls.stream()
                .map(url -> PropertyImage.builder()
                        .imageUrl(url)
                        .property(existingProperty)  // back-reference
                        .build())
                .toList();

        existingProperty.setImageUrls(imageEntities);
        propertiesRepository.save(existingProperty);

    }

    @Async
    public void uploadUserImageAsync(Long userId,byte[] imageByteArray,String fileName){
        Optional<User> optionalUser=userRepository.findById(userId);
        String profileImage=null;
        try{
            profileImage=cloudinaryService.uploadFile(imageByteArray,fileName);
        }catch(IOException e) {
            throw new RuntimeException("Cloudinary Image upload failed!!");
        }
        if(optionalUser.isPresent()) {
            User existingUser=optionalUser.get();
            existingUser.setProfileImage(profileImage);
            userRepository.save(existingUser);
        }
    }
}
