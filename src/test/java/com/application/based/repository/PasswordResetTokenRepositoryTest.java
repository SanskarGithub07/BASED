package com.application.based.repository;

import com.application.based.entity.PasswordResetToken;
import com.application.based.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Calendar;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class PasswordResetTokenRepositoryTest {

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("findByToken should return token when it exists")
    void testFindByTokenWhenTokenExists() {
        // Given
        User user = User.builder()
                .username("resetuser")
                .email("reset@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        String tokenValue = "test-reset-token-123";
        PasswordResetToken token = new PasswordResetToken(user, tokenValue);
        passwordResetTokenRepository.save(token);

        // When
        PasswordResetToken found = passwordResetTokenRepository.findByToken(tokenValue);

        // Then
        assertThat(found).isNotNull();
        assertThat(found.getToken()).isEqualTo(tokenValue);
        assertThat(found.getUser().getUsername()).isEqualTo("resetuser");
    }

    @Test
    @DisplayName("findByToken should return null when token doesn't exist")
    void testFindByTokenWhenTokenDoesNotExist() {
        // When
        PasswordResetToken found = passwordResetTokenRepository.findByToken("non-existent-token");

        // Then
        assertThat(found).isNull();
    }

    @Test
    @DisplayName("Token expiration time should be set correctly")
    void testTokenExpirationTime() {
        // Given
        User user = User.builder()
                .username("expiryuser")
                .email("expiry@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        // Create a token with 10 minutes expiration
        PasswordResetToken token = new PasswordResetToken(user, "expiry-test-token");
        passwordResetTokenRepository.save(token);

        // When
        PasswordResetToken savedToken = passwordResetTokenRepository.findByToken("expiry-test-token");

        // Then
        // Calculate expected expiry time (10 minutes from now, with some tolerance)
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(new Date().getTime());
        cal.add(Calendar.MINUTE, 10);
        Date expectedExpiry = cal.getTime();

        // Verify expiration time is set correctly (within a 2-minute tolerance)
        long timeDifference = Math.abs(savedToken.getExpirationTime().getTime() - expectedExpiry.getTime());
        assertThat(timeDifference).isLessThan(120000); // Less than 2 minutes difference
    }

    @Test
    @DisplayName("Token should be linked to correct user")
    void testTokenUserAssociation() {
        // Given
        User user1 = User.builder()
                .username("user1")
                .email("user1@example.com")
                .password("password")
                .enabled(true)
                .build();

        User user2 = User.builder()
                .username("user2")
                .email("user2@example.com")
                .password("password")
                .enabled(true)
                .build();

        userRepository.saveAll(java.util.List.of(user1, user2));

        PasswordResetToken token1 = new PasswordResetToken(user1, "token-for-user1");
        PasswordResetToken token2 = new PasswordResetToken(user2, "token-for-user2");
        passwordResetTokenRepository.saveAll(java.util.List.of(token1, token2));

        // When
        PasswordResetToken foundToken1 = passwordResetTokenRepository.findByToken("token-for-user1");
        PasswordResetToken foundToken2 = passwordResetTokenRepository.findByToken("token-for-user2");

        // Then
        assertThat(foundToken1.getUser().getId()).isEqualTo(user1.getId());
        assertThat(foundToken2.getUser().getId()).isEqualTo(user2.getId());
    }
}