package com.application.based.repository;

import com.application.based.entity.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

@DataJpaTest
class RoleRepositoryTest {

    @Autowired
    private RoleRepository roleRepository;

    @Test
    @DisplayName("findByName should return role when name exists")
    void testFindByNameWhenNameExists() {
        // Given
        Role role = Role.builder()
                .name("ROLE_ADMIN")
                .build();
        roleRepository.save(role);

        // When
        Optional<Role> found = roleRepository.findByName("ROLE_ADMIN");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("ROLE_ADMIN");
    }

    @Test
    @DisplayName("findByName should return empty when name doesn't exist")
    void testFindByNameWhenNameDoesNotExist() {
        // When
        Optional<Role> found = roleRepository.findByName("ROLE_NONEXISTENT");

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("Role should be correctly saved and retrieved by ID")
    void testSaveAndFindById() {
        // Given
        Role role = Role.builder()
                .name("ROLE_USER")
                .build();
        Role savedRole = roleRepository.save(role);

        // When
        Optional<Role> found = roleRepository.findById(savedRole.getId());

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("ROLE_USER");
    }

    @Test
    @DisplayName("Role name unique constraint should prevent duplicate names")
    void testUniqueNameConstraint() {
        // Given
        Role role1 = Role.builder()
                .name("ROLE_MANAGER")
                .build();
        roleRepository.save(role1);

        // When & Then
        Role role2 = Role.builder()
                .name("ROLE_MANAGER") // Same name as role1
                .build();

        assertThatExceptionOfType(DataIntegrityViolationException.class)
                .isThrownBy(() -> roleRepository.saveAndFlush(role2))
                .withMessageContaining("constraint");
    }

    @Test
    @DisplayName("Case sensitivity in role names should be preserved")
    void testRoleNameCaseSensitivity() {
        // Given
        Role lowerCaseRole = Role.builder()
                .name("role_user")
                .build();
        Role upperCaseRole = Role.builder()
                .name("ROLE_USER")
                .build();
        roleRepository.saveAll(java.util.List.of(lowerCaseRole, upperCaseRole));

        // When
        Optional<Role> foundLowerCase = roleRepository.findByName("role_user");
        Optional<Role> foundUpperCase = roleRepository.findByName("ROLE_USER");

        // Then
        assertThat(foundLowerCase).isPresent();
        assertThat(foundUpperCase).isPresent();
        assertThat(foundLowerCase.get().getId()).isNotEqualTo(foundUpperCase.get().getId());
    }
}