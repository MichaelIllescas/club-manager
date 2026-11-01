package com.clubmanager.service;

import com.clubmanager.dto.EstadoUsuarioDTO;
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
    private final UserRepository usuarioRepository;

    // Crear un nuevo usuario
    public UserDTO createUser(UserDTO userDTO) {
        User user = toEntity(userDTO);
        User savedUser = userRepository.save(user);
        return toDTO(savedUser);
    }

    // Obtener todos los usuarios
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Obtener un usuario por ID
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return toDTO(user);
    }

    // Actualizar un usuario
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setFirstName(userDTO.getNombre());
        user.setLastName(userDTO.getApellido());
        user.setDni(userDTO.getDni());
        user.setTelefono(userDTO.getTelefono());
        user.setDireccion(userDTO.getDireccion());
        user.setEmail(userDTO.getEmail());
        user.setEnabled(userDTO.getEstado().equals("ACTIVO")?true:false);
        user.setRole(userDTO.getRol());

        User updatedUser = userRepository.save(user);
        return toDTO(updatedUser);
    }

    // Eliminar un usuario (cambio de estado en lugar de eliminación física)
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setEnabled(false); // Deshabilitar el usuario
        userRepository.save(user);
    }

    // Conversión de entidad a DTO
    public UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .nombre(user.getFirstName())
                .apellido(user.getLastName())
                .dni(user.getDni())
                .telefono(user.getTelefono())
                .direccion(user.getDireccion())
                .email(user.getEmail())
                .estado(user.isEnabled()?"ACTIVO":"INACTIVO")
                .rol(user.getRole())
                .build();
    }

    // Conversión de DTO a entidad
    private User toEntity(UserDTO userDTO) {
        return User.builder()
                .id(userDTO.getId())
                .firstName(userDTO.getNombre())
                .lastName(userDTO.getApellido())
                .dni(userDTO.getDni())
                .telefono(userDTO.getTelefono())
                .direccion(userDTO.getDireccion())
                .email(userDTO.getEmail())
                .enabled(userDTO.getEstado().equals("ACTIVO")?true:false)
                .role(userDTO.getRol().equals(Role.ADMIN.toString())?Role.ADMIN:Role.USER)
                .build();
    }

    public void anularUsuario(Long id) {
        Optional<User> user = userRepository.findById(id);
        user.get().setEnabled(false);
        userRepository.save(user.get());
    }

    public void habilitarUsuario(Long id) {
        Optional<User> user = userRepository.findById(id);
        user.get().setEnabled(true);
        userRepository.save(user.get());
    }

    public List<EstadoUsuarioDTO> getEstadosSocios() {
        return userRepository.findAll()
                .stream().map(this::toEstadoUsuarioDTO)
                .collect(Collectors.toList());
    }

    public EstadoUsuarioDTO toEstadoUsuarioDTO(User user){
        return EstadoUsuarioDTO.builder()
                .id(user.getId())
                .nombre(user.getFirstName())
                .apellido(user.getLastName())
                .dni(user.getDni())
                .email(user.getEmail())
                .estado(user.isEnabled()?"ACTIVO":"INACTIVO")
                .build();
    }

    public UserDTO getPerfil() {
        return toDTO(obtenerUsuarioActual());
    }

    public boolean updatePassword(String currentPassword, String newPassword) {
        User user = obtenerUsuarioActual();

        // Verificar si la contraseña actual coincide
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false; // La contraseña actual es incorrecta
        }

        // Actualizar la contraseña en la base de datos
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    // Restablecer la contraseña
    public void resetearClave(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Obtener el DNI del usuario
        String dni = user.getDni();

        // Encriptar la nueva contraseña usando el DNI
        String claveEncriptada = passwordEncoder.encode(dni);

        // Establecer la nueva contraseña encriptada
        user.setPassword(claveEncriptada);

        // Guardar el usuario con la nueva contraseña
        userRepository.save(user);
    }

    public void insertAdminUser(){
        Optional<User> existingUser = userRepository.findByEmail("admin@admin.com");

        if (existingUser.isEmpty()) { // Solo si no existe, lo creamos
            User admin = User.builder()
                    .firstName("Administrador")
                    .lastName("General")
                    .dni("00000000")
                    .telefono("0000000000")
                    .direccion("Sin dirección")
                    .email("admin@admin.com") // Usar el mismo email que estás buscando
                    .password(passwordEncoder.encode("admin"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
        }
    }

    // El filtro JWT ya autenticó al usuario: se toma del contexto de seguridad
    public User obtenerUsuarioActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
