package com.clubmanager.service;

import com.clubmanager.exception.ResourceNotFoundException;

import com.clubmanager.dto.UserStatusDTO;
import com.clubmanager.dto.UserDTO;
import com.clubmanager.entity.Role;
import com.clubmanager.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.clubmanager.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO createUser(UserDTO userDTO) {
        User user = toEntity(userDTO);
        User savedUser = userRepository.save(user);
        return toDTO(savedUser);
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return toDTO(user);
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setDni(userDTO.getDni());
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());
        user.setEmail(userDTO.getEmail());
        user.setEnabled(userDTO.getStatus().equals("ACTIVE")?true:false);
        user.setRole(userDTO.getRole());

        User updatedUser = userRepository.save(user);
        return toDTO(updatedUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        user.setEnabled(false);
        userRepository.save(user);
    }

    public UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .dni(user.getDni())
                .phone(user.getPhone())
                .address(user.getAddress())
                .email(user.getEmail())
                .status(user.isEnabled()?"ACTIVE":"INACTIVE")
                .role(user.getRole())
                .build();
    }

    private User toEntity(UserDTO userDTO) {
        return User.builder()
                .id(userDTO.getId())
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .dni(userDTO.getDni())
                .phone(userDTO.getPhone())
                .address(userDTO.getAddress())
                .email(userDTO.getEmail())
                .enabled(userDTO.getStatus().equals("ACTIVE")?true:false)
                .role(userDTO.getRole().equals(Role.ADMIN.toString())?Role.ADMIN:Role.USER)
                .build();
    }

    public void deactivateUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        user.get().setEnabled(false);
        userRepository.save(user.get());
    }

    public void activateUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        user.get().setEnabled(true);
        userRepository.save(user.get());
    }

    public List<UserStatusDTO> getUserStatuses() {
        return userRepository.findAll()
                .stream().map(this::toUserStatusDTO)
                .collect(Collectors.toList());
    }

    public UserStatusDTO toUserStatusDTO(User user){
        return UserStatusDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .dni(user.getDni())
                .email(user.getEmail())
                .status(user.isEnabled()?"ACTIVE":"INACTIVE")
                .build();
    }

    public UserDTO getProfile() {
        return toDTO(getCurrentUser());
    }

    public boolean updatePassword(String currentPassword, String newPassword) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    public void resetPassword(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        String dni = user.getDni();

        String encodedPassword = passwordEncoder.encode(dni);

        user.setPassword(encodedPassword);

        userRepository.save(user);
    }

    public void insertAdminUser(){
        Optional<User> existingUser = userRepository.findByEmail("admin@admin.com");

        if (existingUser.isEmpty()) {
            User admin = User.builder()
                    .firstName("Administrador")
                    .lastName("General")
                    .dni("00000000")
                    .phone("0000000000")
                    .address("Sin dirección")
                    .email("admin@admin.com")
                    .password(passwordEncoder.encode("admin"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
        }
    }

    // The JWT filter already authenticated the user: read it from the security context
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
