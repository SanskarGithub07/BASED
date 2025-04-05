package com.application.based.initialize;

import com.application.based.entity.Role;
import com.application.based.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class RoleInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;

    public RoleInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        List<String> roles = Arrays.asList("ROLE_CUSTOMER", "ROLE_STAFF", "ROLE_EMPLOYEE");
        roles.forEach(roleName -> {
            roleRepository.findByName(roleName).orElseGet(() -> {
                Role newRole = new Role();
                newRole.setName(roleName);
                return roleRepository.save(newRole);
            });
        });
    }
}

