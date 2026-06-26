package com.example.ttcs_be;

import com.example.ttcs_be.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestDbConfig {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testUsers() {
        System.out.println("====== USERS IN DB ======");
        userRepository.findAll().forEach(u -> {
            System.out.println("User: " + u.getEmail() + " | Pass: " + u.getPassword());
        });
        System.out.println("=========================");
    }
}
