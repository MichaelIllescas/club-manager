package com.clubmanager.service;

import com.clubmanager.exception.RecursoNoEncontradoException;

import com.clubmanager.exception.DatoInvalidoException;

import com.clubmanager.exception.DatoDuplicadoException;

import com.clubmanager.dto.SocioDTO;
import com.clubmanager.entity.Socio;
import com.clubmanager.repository.SocioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SocioService {

    private final SocioRepository socioRepository;

    @Autowired
    public SocioService(SocioRepository socioRepository) {
        this.socioRepository = socioRepository;
    }

    // Crear un nuevo socio con validaciones de duplicados (DNI y número de socio)
    public SocioDTO crearSocio(SocioDTO socioDTO) {
        // Validar DNI (obligatorio y único)
        String dni = validarDniObligatorio(socioDTO.getDni());
        if (socioRepository.existsByDni(dni)) {
            throw new DatoDuplicadoException("Ya existe un socio con el DNI: " + dni);
        }

        // Validar número de socio
        String numeroSocio = socioDTO.getNumeroSocio();
        if (numeroSocio != null && !numeroSocio.isBlank()) {
            if (socioRepository.existsByNumeroSocio(numeroSocio)) {
                throw new DatoDuplicadoException("Ya existe un socio con el número de socio: " + numeroSocio);
            }
        }

        Socio socio = fromDTO(socioDTO);
        socio.setFechaRegistro(LocalDate.now());
        socio.setEstado(Socio.EstadoSocio.ACTIVO);

        Socio socioGuardado = socioRepository.save(socio);
        return toDTO(socioGuardado);
    }

    // Obtener un socio por ID
    public Optional<SocioDTO> obtenerSocioPorId(Long id) {
        return socioRepository.findById(id).map(this::toDTO);
    }

    // Listar todos los socios
    public List<SocioDTO> listarTodosLosSocios() {
        return socioRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Actualizar un socio existente con validaciones de duplicados (se ignora el propio registro)
    public SocioDTO actualizarSocio(Long id, SocioDTO socioDTO) {
        Socio socioExistente = socioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Socio no encontrado con el ID: " + id));

        // Validar nuevo DNI (obligatorio y único)
        String nuevoDni = validarDniObligatorio(socioDTO.getDni());
        if (socioRepository.existsByDniAndIdNot(nuevoDni, id)) {
            throw new DatoDuplicadoException("No se puede actualizar: ya existe otro socio con el DNI: " + nuevoDni);
        }
        socioExistente.setDni(nuevoDni);

        // Validar nuevo número de socio (si viene)
        String nuevoNumeroSocio = socioDTO.getNumeroSocio();
        if (nuevoNumeroSocio != null && !nuevoNumeroSocio.isBlank()) {
            if (socioRepository.existsByNumeroSocioAndIdNot(nuevoNumeroSocio, id)) {
                throw new DatoDuplicadoException("No se puede actualizar: ya existe otro socio con el número de socio: " + nuevoNumeroSocio);
            }
            socioExistente.setNumeroSocio(nuevoNumeroSocio);
        } else {
            socioExistente.setNumeroSocio(null);
        }

        // Actualizar otros campos
        socioExistente.setNombre(socioDTO.getNombre());
        socioExistente.setApellido(socioDTO.getApellido());
        socioExistente.setDireccion(socioDTO.getDireccion());
        socioExistente.setTelefono(socioDTO.getTelefono());
        socioExistente.setEmail(socioDTO.getEmail());

        if (socioDTO.getEstado() != null) {
            socioExistente.setEstado(Socio.EstadoSocio.valueOf(socioDTO.getEstado()));
        }

        Socio socioActualizado = socioRepository.save(socioExistente);
        return toDTO(socioActualizado);
    }

    // Anular (desactivar) un socio
    public void anularSocio(Long id) {
        Socio socio = socioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Socio no encontrado con el ID: " + id));
        socio.anular();
        socioRepository.save(socio);
    }

    // Habilitar un socio
    public void habilitarSocio(Long id) {
        Socio socio = socioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Socio no encontrado con el ID: " + id));
        socio.habilitar();
        socioRepository.save(socio);
    }

    // El DNI es obligatorio: sin esta validación la base rechaza el registro con un error 500
    private String validarDniObligatorio(String dni) {
        if (dni == null || dni.isBlank()) {
            throw new DatoInvalidoException("El DNI del socio es obligatorio.");
        }
        return dni.trim();
    }

    // Convertir Socio a SocioDTO
    private SocioDTO toDTO(Socio socio) {
        return new SocioDTO(
                socio.getId(),
                socio.getNombre(),
                socio.getApellido(),
                socio.getDni(),
                socio.getTelefono(),
                socio.getEmail(),
                socio.getNumeroSocio(),
                socio.getFechaRegistro() != null ? socio.getFechaRegistro().toString() : null,
                socio.getDireccion(),
                socio.getEstado() != null ? socio.getEstado().name() : null
        );
    }

    // Convertir SocioDTO a Socio
    private Socio fromDTO(SocioDTO socioDTO) {

        // 👉 NORMALIZAMOS numeroSocio
        String numeroSocio = socioDTO.getNumeroSocio();
        if (numeroSocio != null && numeroSocio.isBlank()) {
            numeroSocio = null;
        }

        return new Socio(
                socioDTO.getId(),
                socioDTO.getNombre(),
                socioDTO.getApellido(),
                socioDTO.getDni(),
                socioDTO.getDireccion(),
                socioDTO.getTelefono(),
                socioDTO.getEmail(),
                numeroSocio, // 👈 usamos el valor corregido
                socioDTO.getFechaRegistro() != null ? LocalDate.parse(socioDTO.getFechaRegistro()) : null,
                null,
                socioDTO.getEstado() != null ? Socio.EstadoSocio.valueOf(socioDTO.getEstado()) : Socio.EstadoSocio.ACTIVO,
                new ArrayList<>()
        );
    }


}
