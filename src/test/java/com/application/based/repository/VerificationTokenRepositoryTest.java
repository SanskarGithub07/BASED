package com.application.based.repository;

import com.application.based.entity.User;
import com.application.based.entity.VerificationToken;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Calendar;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class VerificationTokenRepositoryTest {

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("findByToken should return token when it exists")
    void testFindByTokenWhenTokenExists() {
        // Given
        User user = User.builder()
                .username("verifyuser")
                .email("verify@example.com")
                .password("password")
                .enabled(false) // usually not enabled until verified
                .build();
        userRepository.save(user);

        String tokenValue = "test-verification-token-123";
        VerificationToken token = new VerificationToken(user, tokenValue);
        verificationTokenRepository.save(token);

        // When
        VerificationToken found = verificationTokenRepository.findByToken(tokenValue);

        // Then
        assertThat(found).isNotNull();
        assertThat(found.getToken()).isEqualTo(tokenValue);
        assertThat(found.getUser().getUsername()).isEqualTo("verifyuser");
    }

    @Test
    @DisplayName("findByToken should return null when token doesn't exist")
    void testFindByTokenWhenTokenDoesNotExist() {
        // When
        VerificationToken found = verificationTokenRepository.findByToken("non-existent-token");

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
                .enabled(false)
                .build();
        userRepository.save(user);

        // Create a token with 10 minutes expiration
        VerificationToken token = new VerificationToken(user, "expiry-test-token");
        verificationTokenRepository.save(token);

        // When
        VerificationToken savedToken = verificationTokenRepository.findByToken("expiry-test-token");

        // Then
        // Calculate expected expiry time (10 minutes from now)
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
                .enabled(false)
                .build();

        User user2 = User.builder()
                .username("user2")
                .email("user2@example.com")
                .password("password")
                .enabled(false)
                .build();

        userRepository.saveAll(java.util.List.of(user1, user2));

        VerificationToken token1 = new VerificationToken(user1, "verify-token-for-user1");
        VerificationToken token2 = new VerificationToken(user2, "verify-token-for-user2");
        verificationTokenRepository.saveAll(java.util.List.of(token1, token2));

        // When
        VerificationToken foundToken1 = verificationTokenRepository.findByToken("verify-token-for-user1");
        VerificationToken foundToken2 = verificationTokenRepository.findByToken("verify-token-for-user2");

        // Then
        assertThat(foundToken1.getUser().getId()).isEqualTo(user1.getId());
        assertThat(foundToken2.getUser().getId()).isEqualTo(user2.getId());
    }

    @Test
    @DisplayName("Token constructor should set correct expiration time")
    void testTokenConstructor() {
        // Given
        String tokenString = "test-token-constructor";

        // When
        VerificationToken token = new VerificationToken(tokenString);

        // Then
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, 10);
        Date expectedTime = cal.getTime();

        // Allow 1 second margin
        long diffInMillis = Math.abs(token.getExpirationTime().getTime() - expectedTime.getTime());
        assertThat(diffInMillis).isLessThan(1000);
    }
}