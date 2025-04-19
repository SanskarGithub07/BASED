package com.application.based.repository;

import com.application.based.entity.BlacklistedJWTToken;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BlacklistedJWTTokenRepositoryTest {

    @Autowired
    private BlacklistedJWTTokenRepository blacklistedJWTTokenRepository;

    @Test
    @DisplayName("existsByToken should return true when token exists")
    void testExistsByTokenWhenTokenExists() {
        // Given
        BlacklistedJWTToken token = BlacklistedJWTToken.builder()
                .token("token-123")
                .expiryDate(new Date(System.currentTimeMillis() + 3600 * 1000)) // 1 hour from now
                .build();
        blacklistedJWTTokenRepository.save(token);

        // When
        boolean exists = blacklistedJWTTokenRepository.existsByToken("token-123");

        // Then
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("existsByToken should return false when token does not exist")
    void testExistsByTokenWhenTokenDoesNotExist() {
        // When
        boolean exists = blacklistedJWTTokenRepository.existsByToken("nonexistent-token");

        // Then
        assertThat(exists).isFalse();
    }

    @Test
    @DisplayName("expiryDate should be correctly saved and retrieved")
    void testExpiryDatePersistence() {
        // Given
        Date expiry = new Date(System.currentTimeMillis() + 7200 * 1000); // 2 hours from now
        BlacklistedJWTToken token = BlacklistedJWTToken.builder()
                .token("token-with-expiry")
                .expiryDate(expiry)
                .build();
        blacklistedJWTTokenRepository.save(token);

        // When
        BlacklistedJWTToken saved = blacklistedJWTTokenRepository.findById("token-with-expiry").orElse(null);

        // Then
        assertThat(saved).isNotNull();
        // Compare time values instead of exact object equality
        assertThat(saved.getExpiryDate().getTime()).isEqualTo(expiry.getTime());
    }
}
