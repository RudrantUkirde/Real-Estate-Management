package com.example.REM_Backend.Service;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(byte[] fileBytes, String filename) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(fileBytes, Map.of("folder","real-estate-properties"));
        return (String) uploadResult.get("url");
    }


}
