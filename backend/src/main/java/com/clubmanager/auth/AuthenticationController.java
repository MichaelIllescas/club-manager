package com.clubmanager.auth;

import com.clubmanager.dto.UserDTO;
import com.clubmanager.entity.Role;
import com.clubmanager.service.CookieService;
import com.clubmanager.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final CookieService cookieService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> registerUser(
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.registerUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response
    ) {
        AuthenticationResponse authResponse = authenticationService.login(request);

        ResponseCookie cookie = cookieService.createAuthCookie(authResponse.getJwt());

        response.addHeader("Set-Cookie", cookie.toString());

        UserDTO userDto = userService.toDTO(authenticationService.getUserByEmail(request.getEmail()).get());

        return ResponseEntity.ok(userDto);

    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Expired cookie with the same attributes, so the browser deletes it
        ResponseCookie cookie = cookieService.clearAuthCookie();

        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.ok("Logout successful!");
    }

    @GetMapping("/roles")
    public ResponseEntity<List<String>> getRoles() {
        List<String> roles = Arrays.stream(Role.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }
}
