package com.clubmanager;

import com.clubmanager.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ClubManagerApplication {

	@Autowired
	private  UserService  userService;

	public static void main(String[] args) {
		SpringApplication.run(ClubManagerApplication.class, args);
	}
	@PostConstruct
	public void init() {
		userService.insertAdminUser();
	}

}
