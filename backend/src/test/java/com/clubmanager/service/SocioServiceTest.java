package com.clubmanager.service;

import com.clubmanager.dto.SocioDTO;
import com.clubmanager.entity.Socio;
import com.clubmanager.repository.SocioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SocioServiceTest {

    @Mock
    private SocioRepository socioRepository;

    private SocioService socioService;

    @BeforeEach
    void setUp() {
        socioService = new SocioService(socioRepository);
    }

    private SocioDTO nuevoSocio(String dni, String numeroSocio) {
        SocioDTO dto = new SocioDTO();
        dto.setNombre("Ana");
        dto.setApellido("Gomez");
        dto.setDni(dni);
        dto.setNumeroSocio(numeroSocio);
        return dto;
    }

    @Test
    void crearSocio_registraActivoConFechaDeHoy() {
        when(socioRepository.existsByDni("30111222")).thenReturn(false);
        when(socioRepository.existsByNumeroSocio("15")).thenReturn(false);
        when(socioRepository.save(any(Socio.class))).thenAnswer(inv -> inv.getArgument(0));

        SocioDTO creado = socioService.crearSocio(nuevoSocio("30111222", "15"));

        assertThat(creado.getEstado()).isEqualTo("ACTIVO");
        assertThat(creado.getFechaRegistro()).isEqualTo(LocalDate.now().toString());
        assertThat(creado.getNumeroSocio()).isEqualTo("15");
    }

    @Test
    void crearSocio_rechazaDniDuplicado() {
        when(socioRepository.existsByDni("30111222")).thenReturn(true);

        assertThatThrownBy(() -> socioService.crearSocio(nuevoSocio("30111222", null)))
                .hasMessageContaining("DNI");
        verify(socioRepository, never()).save(any());
    }

    @Test
    void crearSocio_rechazaNumeroDeSocioDuplicado() {
        when(socioRepository.existsByDni("30111222")).thenReturn(false);
        when(socioRepository.existsByNumeroSocio("15")).thenReturn(true);

        assertThatThrownBy(() -> socioService.crearSocio(nuevoSocio("30111222", "15")))
                .hasMessageContaining("número de socio");
        verify(socioRepository, never()).save(any());
    }

    @Test
    void crearSocio_guardaNumeroDeSocioVacioComoNulo() {
        when(socioRepository.existsByDni("30111222")).thenReturn(false);
        when(socioRepository.save(any(Socio.class))).thenAnswer(inv -> inv.getArgument(0));

        socioService.crearSocio(nuevoSocio("30111222", "  "));

        ArgumentCaptor<Socio> guardado = ArgumentCaptor.forClass(Socio.class);
        verify(socioRepository).save(guardado.capture());
        assertThat(guardado.getValue().getNumeroSocio()).isNull();
    }

    @Test
    void actualizarSocio_rechazaDniDeOtroSocio() {
        when(socioRepository.findById(1L)).thenReturn(Optional.of(new Socio()));
        when(socioRepository.existsByDniAndIdNot("30111222", 1L)).thenReturn(true);

        assertThatThrownBy(() -> socioService.actualizarSocio(1L, nuevoSocio("30111222", null)))
                .hasMessageContaining("otro socio");
    }

    @Test
    void actualizarSocio_fallaSiNoExiste() {
        when(socioRepository.findById(9L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> socioService.actualizarSocio(9L, nuevoSocio("1", null)))
                .hasMessageContaining("no encontrado");
    }

    @Test
    void anularYHabilitar_cambianElEstado() {
        Socio socio = new Socio();
        socio.setEstado(Socio.EstadoSocio.ACTIVO);
        when(socioRepository.findById(1L)).thenReturn(Optional.of(socio));

        socioService.anularSocio(1L);
        assertThat(socio.getEstado()).isNotEqualTo(Socio.EstadoSocio.ACTIVO);

        socioService.habilitarSocio(1L);
        assertThat(socio.getEstado()).isEqualTo(Socio.EstadoSocio.ACTIVO);
    }
}
