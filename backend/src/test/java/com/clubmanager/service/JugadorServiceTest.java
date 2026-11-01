package com.clubmanager.service;

import com.clubmanager.entity.EstadoJugador;
import com.clubmanager.entity.Jugador;
import com.clubmanager.exception.RecursoNoEncontradoException;
import com.clubmanager.repository.JugadorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
class JugadorServiceTest {

    @Mock
    private JugadorRepository jugadorRepository;

    private JugadorService jugadorService;

    @BeforeEach
    void setUp() {
        jugadorService = new JugadorService(jugadorRepository);
    }

    @Test
    void crearJugador_asignaFechaDeRegistroYQuedaActivo() {
        when(jugadorRepository.save(any(Jugador.class))).thenAnswer(inv -> inv.getArgument(0));

        Jugador creado = jugadorService.crearJugador(new Jugador());

        assertThat(creado.getFechaRegistro()).isEqualTo(LocalDate.now());
        assertThat(creado.getEstado()).isEqualTo(EstadoJugador.ACTIVO);
    }

    @Test
    void actualizarJugador_fallaSiNoExiste() {
        when(jugadorRepository.existsById(3L)).thenReturn(false);

        assertThatThrownBy(() -> jugadorService.actualizarJugador(3L, new Jugador()))
                .isInstanceOf(RecursoNoEncontradoException.class);
        verify(jugadorRepository, never()).save(any());
    }

    @Test
    void actualizarJugador_conservaElId() {
        when(jugadorRepository.existsById(3L)).thenReturn(true);
        when(jugadorRepository.save(any(Jugador.class))).thenAnswer(inv -> inv.getArgument(0));

        Jugador actualizado = jugadorService.actualizarJugador(3L, new Jugador());

        assertThat(actualizado.getId()).isEqualTo(3L);
    }

    @Test
    void deshabilitarYHabilitar_cambianElEstado() {
        Jugador jugador = new Jugador();
        when(jugadorRepository.findById(1L)).thenReturn(Optional.of(jugador));

        jugadorService.deshabilitarJugador(1L);
        assertThat(jugador.getEstado()).isEqualTo(EstadoJugador.ANULADO);

        jugadorService.habilitarJugador(1L);
        assertThat(jugador.getEstado()).isEqualTo(EstadoJugador.ACTIVO);
    }

    @Test
    void anularJugador_registraLaFechaDeBaja() {
        Jugador jugador = new Jugador();
        when(jugadorRepository.findById(1L)).thenReturn(Optional.of(jugador));

        jugadorService.anularJugador(1L);

        assertThat(jugador.getFechaBaja()).isEqualTo(LocalDate.now());
    }
}
