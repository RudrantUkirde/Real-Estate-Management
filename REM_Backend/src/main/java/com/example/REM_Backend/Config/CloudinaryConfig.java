package com.example.REM_Backend.Config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Value("${cloud.name}")
    private String CloudName;

    @Value("${cloud.apiKey}")
    private String ApiKey;

    @Value("${cloud.apiSecret}")
    private String ApiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", CloudName,
                "api_key", ApiKey,
                "api_secret", ApiSecret,
                "secure",true));
    }
}
