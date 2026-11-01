package com.clubmanager.controller;

import com.clubmanager.dto.UserStatusDTO;
import com.clubmanager.dto.UpdatePasswordRequestDTO;
import com.clubmanager.dto.UserDTO;
import com.clubmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

        private final UserService userService;

        @PostMapping
        public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
            UserDTO createdUser = userService.createUser(userDTO);
            return ResponseEntity.ok(createdUser);
        }

        @GetMapping
        public ResponseEntity<List<UserDTO>> getAllUsers() {
            List<UserDTO> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        }

        @GetMapping("/{id}")
        public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
            UserDTO user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        }

        @PutMapping("/{id}")
        public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
            UserDTO updatedUser = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(updatedUser);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        }
        @PutMapping("/{id}/deactivate")
        public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
            userService.deactivateUser(id);
            return ResponseEntity.noContent().build();

        }

        @PutMapping("/{id}/activate")
        public ResponseEntity<Void> activateUser(@PathVariable Long id) {
            userService.activateUser(id);
            return ResponseEntity.noContent().build();

        }

        @GetMapping("/statuses")
        public ResponseEntity<List<UserStatusDTO>> getUserStatuses(){
                return ResponseEntity.ok(userService.getUserStatuses());
        }

        @GetMapping("/me")
        public ResponseEntity<UserDTO> getProfile() {
            return ResponseEntity.ok(userService.getProfile());
        }

        @PutMapping("/me/password")
        public ResponseEntity<Map<String, String>> updatePassword(
                @RequestBody UpdatePasswordRequestDTO updatePasswordRequestDTO
        ) {
            boolean isUpdated = userService.updatePassword(
                    updatePasswordRequestDTO.getCurrentPassword(),
                    updatePasswordRequestDTO.getNewPassword()
            );

            if (isUpdated) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Contraseña actualizada correctamente.");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "La contraseña actual es incorrecta.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
        }

        @PostMapping("/{id}/reset-password")
        public ResponseEntity<String> resetPassword(@PathVariable Long id) {
            userService.resetPassword(id);
            return ResponseEntity.ok("Contraseña reseteada exitosamente.");

        }

}

