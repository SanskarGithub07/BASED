package com.application.based.service;

import com.application.based.entity.User;
import com.application.based.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        log.debug("Attempting to load user by username/email: {}", usernameOrEmail);

        User userDetail = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> {
                    log.warn("User not found with identifier: {}", usernameOrEmail);
                    return new UsernameNotFoundException("User not exists by Username or Email");
                });

        boolean useEmail = usernameOrEmail.equals(userDetail.getEmail());
        log.trace("User {} authenticated using {}",
                  userDetail.getUsername(),
                  useEmail ? "email" : "username");

        return new UserInfoDetails(userDetail, useEmail);
    }
}