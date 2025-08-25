package com.example.REM_Backend.Entity;


import com.example.REM_Backend.Dto.PropertyResponseDto;
import com.example.REM_Backend.Enums.PropertyType;
import com.example.REM_Backend.Enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Enumerated(EnumType.STRING)
    private PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Column(length = 2000)
    private String description;

    private String address;

    private Double price;

    private Double latitude;

    private Double longitude;

//    @ElementCollection
//    @CollectionTable(name = "property_features", joinColumns = @JoinColumn(name = "property_id"))
//    @Column(name = "feature")
//    private List<String> features;
//
//    @ElementCollection
//    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
//    @Column(name = "image_url")
//    private List<String> imageUrls;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<PropertyFeature> features = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<PropertyImage> imageUrls = new java.util.ArrayList<>();

    // 🔗 Many Properties belong to One User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User user;


    // Convenience helpers (recommended)
    public void addFeature(String value) {
        PropertyFeature pf = PropertyFeature.builder().feature(value).property(this).build();
        this.features.add(pf);
    }
    public void removeFeature(String value) {
        this.features.removeIf(f -> f.getFeature().equals(value));
    }

    public void addImage(String url) {
        PropertyImage pi = PropertyImage.builder().imageUrl(url).property(this).build();
        this.imageUrls.add(pi);
    }
    public void removeImage(String url) {
        this.imageUrls.removeIf(i -> i.getImageUrl().equals(url));
    }

    public PropertyResponseDto getPropertyResponseDto(){

        PropertyResponseDto propertyResponseDto=new PropertyResponseDto();

        propertyResponseDto.setId(id);
        propertyResponseDto.setTitle(title);
        propertyResponseDto.setDescription(description);
        propertyResponseDto.setLatitude(latitude);
        propertyResponseDto.setLongitude(longitude);
        propertyResponseDto.setPropertyType(propertyType);
        propertyResponseDto.setTransactionType(transactionType);
        propertyResponseDto.setAddress(address);
        propertyResponseDto.setPrice(price);
        propertyResponseDto.setFeatures(this.getFeatures().stream().map(PropertyFeature::getFeature).toList());
        propertyResponseDto.setImageUrls(this.getImageUrls().stream().map(PropertyImage::getImageUrl).toList());

        return propertyResponseDto;

    }

}
