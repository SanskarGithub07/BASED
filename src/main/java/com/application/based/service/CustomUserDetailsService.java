package com.application.based.service;

import com.application.based.entity.User;
import com.application.based.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {

        User userDetail = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not exists by Username or Email"));

        boolean useEmail = false;
        if(userDetail.getEmail().equals(usernameOrEmail)){
            useEmail = true;
        }

        UserInfoDetails userInfoDetails = new UserInfoDetails(userDetail, useEmail);
        return userInfoDetails;
    }
}
