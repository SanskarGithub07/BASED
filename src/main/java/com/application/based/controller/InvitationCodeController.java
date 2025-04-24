package com.application.based.controller;

import com.application.based.model.InvitationCodeDto;
import com.application.based.service.InvitationCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/invitation-codes")
@RequiredArgsConstructor
public class InvitationCodeController {

    private final InvitationCodeService invitationCodeService;

    @PostMapping
    public ResponseEntity<String> generateCode(@RequestBody InvitationCodeDto invitationCodeDto) {
        return ResponseEntity.ok(invitationCodeService.generateCode(invitationCodeDto));
    }

//    @GetMapping("/validate/{code}")
//    public ResponseEntity<Boolean> validateCode(@PathVariable String code) {
//        return ResponseEntity.ok(invitationCodeService.isValidCode(code));
//    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<Map<String, Object>> validateCode(@PathVariable String code) {
        boolean isValid = invitationCodeService.isValid(code);
        String role = isValid ? invitationCodeService.getRoleForCode(code) : null;

        return ResponseEntity.ok(Map.of(
                "valid", isValid,
                "role", role
        ));
    }
    @GetMapping("/role/{code}")
    public ResponseEntity<String> getRoleForCode(@PathVariable String code) {
        return ResponseEntity.ok(invitationCodeService.getRoleForCode(code));
    }
}