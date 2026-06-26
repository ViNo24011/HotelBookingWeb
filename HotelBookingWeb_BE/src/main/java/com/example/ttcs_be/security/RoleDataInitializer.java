package com.example.ttcs_be.security;

import com.example.ttcs_be.model.Role;
import com.example.ttcs_be.model.User;
import com.example.ttcs_be.repository.RoleRepository;
import com.example.ttcs_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Component
@RequiredArgsConstructor
public class RoleDataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Khởi tạo các Role nếu chưa có
        initializeRole("ROLE_USER");
        initializeRole("ROLE_ADMIN");

        // 2. Tạo tài khoản Admin mặc định nếu chưa có
        if (!userRepository.existsByEmail("admin-hotel@gmail.com")) {
            User admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Admin");
            admin.setEmail("admin-hotel@gmail.com");
            admin.setPassword(passwordEncoder.encode("123456"));
            
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").get();
            admin.setRoles(Collections.singletonList(adminRole));
            
            userRepository.save(admin);
            System.out.println("Tài khoản Admin mặc định đã được tạo: admin@gmail.com / 123456");
        }
    }

    private void initializeRole(String roleName) {
        if (!roleRepository.existsByName(roleName)) {
            roleRepository.save(new Role(roleName));
            System.out.println("Role " + roleName + " đã được tạo.");
        }
    }
}
