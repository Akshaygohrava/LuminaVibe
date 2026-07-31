package com.luminavibe;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LuminavibeApplication {

	public static void main(String[] args) {
		SpringApplication.run(LuminavibeApplication.class, args);
		
		System.out.println("LuminaVibe , An Social Media App !");
		System.out.println("Sucessfully ...");
	}

	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

}

