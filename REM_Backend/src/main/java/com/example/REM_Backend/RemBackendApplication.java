package com.example.REM_Backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class RemBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(RemBackendApplication.class, args);
	}

}
