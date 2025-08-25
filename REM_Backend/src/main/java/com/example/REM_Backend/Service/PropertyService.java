package com.example.REM_Backend.Service;

import com.example.REM_Backend.Dto.PropertyRequestDto;
import com.example.REM_Backend.Dto.PropertyResponseDto;
import com.example.REM_Backend.Entity.Property;
import com.example.REM_Backend.Entity.PropertyFeature;
import com.example.REM_Backend.Entity.User;
import com.example.REM_Backend.Repository.PropertiesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;


@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertiesRepository propertiesRepository;
    private final AsyncCloudinaryUpload asyncCloudinaryUpload;

    //Upload property method
    public void createProperty(PropertyRequestDto dto, MultipartFile[] images, User user) throws IOException {

        Property property = Property.builder()
                .title(dto.getTitle())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .description(dto.getDescription())
                .propertyType(dto.getPropertyType())
                .transactionType(dto.getTransactionType())
                .address(dto.getAddress())
//                .feature(dto.getFeatures())
                .price(dto.getPrice())
                .user(user)
                .build();

        // map List<String> -> List<PropertyFeature>
        List<PropertyFeature> featureEntities = Optional.ofNullable(dto.getFeatures())
                .orElseGet(Collections::emptyList)
                .stream()
                .map(f -> PropertyFeature.builder()
                        .feature(f)
                        .property(property)   // back-reference
                        .build())
                .toList();
        property.setFeatures(featureEntities);

        propertiesRepository.save(property);

        List<byte[]> imageBytesList = Arrays.stream(images)
                .map(file -> {
                    try {
                        return file.getBytes();
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }).toList();

        List<String> filenames = Arrays.stream(images)
                .map(MultipartFile::getOriginalFilename)
                .toList();

        asyncCloudinaryUpload.uploadPropertyImagesAsync(property.getId(),imageBytesList, filenames);

    }

    //Get all property method
    public Page<PropertyResponseDto> getAllProperties(Pageable pageable) {
        return propertiesRepository.findAll(pageable).map(Property::getPropertyResponseDto);
    }


    public PropertyResponseDto getPropertyById(Long propertyId){

        Optional<Property> optionalProperty=propertiesRepository.findById(propertyId);

        if(optionalProperty.isEmpty()) {
            throw new UsernameNotFoundException("Property does not Found");
        }
        return optionalProperty.get().getPropertyResponseDto();
    }

}
