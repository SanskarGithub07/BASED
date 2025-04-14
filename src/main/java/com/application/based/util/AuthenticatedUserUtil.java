package com.application.based.util;

import com.application.based.entity.User;
import com.application.based.repository.UserRepository;
import com.application.based.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedUserUtil {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    public User getCurrentAuthenticatedUser(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            throw new RuntimeException("Authorization header missing or malformed");
        }

        String jwtToken = authHeader.substring(7);
        String identity = jwtService.extractUsername(jwtToken);
        String loginType = jwtService.extractClaim(jwtToken, claims -> claims.get("loginType").toString());

        if(loginType.equals("email")){
            try{
                return userRepository.findByEmail(identity).get();
            }
            catch (Exception e){
                throw new UsernameNotFoundException("User not found");
            }
        }
        else if(loginType.equals("username")){
            try{
                return userRepository.findByUsername(identity).get();
            }
            catch (Exception e){
                throw new UsernameNotFoundException("User not found");
            }
        }
        else{
            throw new IllegalArgumentException("Invalid loginType in token");
        }
    }
}
