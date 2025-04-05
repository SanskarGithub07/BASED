package com.application.based.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/hello")
    public String sayHello(){
        return "Hello World";
    }

    @GetMapping("/api/auth/customer/home")
    public String sayWelcome(){
        return  "Welcome to customer home page after logging in.";
    }
}
