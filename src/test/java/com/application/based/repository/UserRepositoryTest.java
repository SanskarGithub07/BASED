package com.application.based.repository;

import com.application.based.entity.Role;
import com.application.based.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Test
    @DisplayName("findByEmail should return user when email exists")
    void testFindByEmailWhenEmailExists() {
        // Given
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        // When
        Optional<User> found = userRepository.findByEmail("test@example.com");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("testuser");
    }

    @Test
    @DisplayName("findByEmail should return empty when email doesn't exist")
    void testFindByEmailWhenEmailDoesNotExist() {
        // When
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("findByUsername should return user when username exists")
    void testFindByUsernameWhenUsernameExists() {
        // Given
        User user = User.builder()
                .username("johnsmith")
                .email("john@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        // When
        Optional<User> found = userRepository.findByUsername("johnsmith");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("john@example.com");
    }

    @Test
    @DisplayName("findByUsername should return empty when username doesn't exist")
    void testFindByUsernameWhenUsernameDoesNotExist() {
        // When
        Optional<User> found = userRepository.findByUsername("nonexistentuser");

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("findByUsernameOrEmail should return user when username exists")
    void testFindByUsernameOrEmailWhenUsernameExists() {
        // Given
        User user = User.builder()
                .username("alice")
                .email("alice@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        // When
        Optional<User> found = userRepository.findByUsernameOrEmail("alice", "unknown@example.com");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    @DisplayName("findByUsernameOrEmail should return user when email exists")
    void testFindByUsernameOrEmailWhenEmailExists() {
        // Given
        User user = User.builder()
                .username("bob")
                .email("bob@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        // When
        Optional<User> found = userRepository.findByUsernameOrEmail("unknown", "bob@example.com");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("bob");
    }

    @Test
    @DisplayName("existsByUsername should return true when username exists")
    void testExistsByUsernameWhenUsernameExists() {
        // Given
        User user = User.builder()
                .username("charlie")
                .email("charlie@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        // When
        boolean exists = userRepository.existsByUsername("charlie");

        // Then
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("existsByUsername should return false when username doesn't exist")
    void testExistsByUsernameWhenUsernameDoesNotExist() {
        // When
        boolean exists = userRepository.existsByUsername("nonexistentuser");

        // Then
        assertThat(exists).isFalse();
    }

    @Test
    @DisplayName("existsByEmail should return true when email exists")
    void testExistsByEmailWhenEmailExists() {
        // Given
        User user = User.builder()
                .username("david")
                .email("david@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        // When
        boolean exists = userRepository.existsByEmail("david@example.com");

        // Then
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("existsByEmail should return false when email doesn't exist")
    void testExistsByEmailWhenEmailDoesNotExist() {
        // When
        boolean exists = userRepository.existsByEmail("nonexistent@example.com");

        // Then
        assertThat(exists).isFalse();
    }

    @Test
    @DisplayName("Unique username constraint should be enforced")
    void testUniqueUsernameConstraint() {
        // Given
        User user1 = User.builder()
                .username("samename")
                .email("user1@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user1);

        // When & Then
        User user2 = User.builder()
                .username("samename")
                .email("user2@example.com")
                .password("password")
                .enabled(true)
                .build();

        assertThatExceptionOfType(DataIntegrityViolationException.class)
                .isThrownBy(() -> userRepository.saveAndFlush(user2))
                .withMessageContaining("constraint");
    }

    @Test
    @DisplayName("Unique email constraint should be enforced")
    void testUniqueEmailConstraint() {
        // Given
        User user1 = User.builder()
                .username("user1")
                .email("same@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user1);

        // When & Then
        User user2 = User.builder()
                .username("user2")
                .email("same@example.com")
                .password("password")
                .enabled(true)
                .build();

        assertThatExceptionOfType(DataIntegrityViolationException.class)
                .isThrownBy(() -> userRepository.saveAndFlush(user2))
                .withMessageContaining("constraint");
    }

    @Test
    @DisplayName("User's roles should be correctly saved and retrieved")
    void testUserRolesRelationship() {
        // Given
        Role adminRole = Role.builder().name("ROLE_ADMIN").build();
        Role userRole = Role.builder().name("ROLE_USER").build();
        roleRepository.saveAll(java.util.List.of(adminRole, userRole));

        Set<Role> roles = new HashSet<>();
        roles.add(adminRole);
        roles.add(userRole);

        User user = User.builder()
                .username("roleuser")
                .email("role@example.com")
                .password("password")
                .enabled(true)
                .roles(roles)
                .build();
        userRepository.save(user);

        // When
        User foundUser = userRepository.findByUsername("roleuser").orElse(null);

        // Then
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getRoles()).hasSize(2);
        assertThat(foundUser.getRoles()).extracting("name")
                .containsExactlyInAnyOrder("ROLE_ADMIN", "ROLE_USER");
    }
}