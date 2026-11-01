package com.clubmanager.service;

import com.clubmanager.dto.JugadorPagoDTO;
import com.clubmanager.dto.RecaudacionMensualDTO;
import com.clubmanager.dto.RecaudacionTrimestralDTO;
import com.clubmanager.entity.Cuota;
import com.clubmanager.entity.EstadoJugador;
import com.clubmanager.entity.Jugador;
import com.clubmanager.entity.Pago;
import com.clubmanager.repository.CuotaRepository;
import com.clubmanager.repository.JugadorRepository;
import com.clubmanager.repository.PagoRepository;
import com.clubmanager.repository.SocioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PagoServiceTest {

    @Mock private PagoRepository pagoRepository;
    @Mock private SocioRepository socioRepository;
    @Mock private JugadorRepository jugadorRepository;
    @Mock private CuotaRepository cuotaRepository;
    @Mock private UserService userService;

    private PagoService pagoService;

    @BeforeEach
    void setUp() {
        pagoService = new PagoService(pagoRepository, socioRepository, jugadorRepository, cuotaRepository, userService);
    }

    @Test
    void recaudacionesPorAnio_completaConCeroLosMesesSinPagos() {
        when(pagoRepository.calcularRecaudacionesPorAnio(2025)).thenReturn(List.of(
                new RecaudacionMensualDTO(1, new BigDecimal("1000")),
                new RecaudacionMensualDTO(12, new BigDecimal("500"))));

        List<BigDecimal> meses = pagoService.obtenerRecaudacionesPorAnio(2025);

        assertThat(meses).hasSize(12);
        assertThat(meses.get(0)).isEqualByComparingTo("1000");
        assertThat(meses.get(5)).isEqualByComparingTo("0");
        assertThat(meses.get(11)).isEqualByComparingTo("500");
    }

    @Test
    void recaudacionesTrimestrales_sumanTresMesesCadaUna() {
        when(pagoRepository.calcularRecaudacionesPorAnio(2025)).thenReturn(List.of(
                new RecaudacionMensualDTO(1, new BigDecimal("100")),
                new RecaudacionMensualDTO(3, new BigDecimal("200")),
                new RecaudacionMensualDTO(4, new BigDecimal("50")),
                new RecaudacionMensualDTO(10, new BigDecimal("70"))));

        List<RecaudacionTrimestralDTO> trimestres = pagoService.obtenerRecaudacionesTrimestrales(2025);

        assertThat(trimestres).extracting(RecaudacionTrimestralDTO::getMonto)
                .usingComparatorForType(BigDecimal::compareTo, BigDecimal.class)
                .containsExactly(new BigDecimal("300"), new BigDecimal("50"), BigDecimal.ZERO, new BigDecimal("70"));
    }

    @Test
    void filtrarPagosPorFecha_conMesYAnioBuscaElMesCompleto() {
        when(pagoRepository.findByFechaPagoBetween(LocalDate.of(2024, 2, 1), LocalDate.of(2024, 2, 29)))
                .thenReturn(List.of());

        pagoService.filtrarPagosPorFecha(null, 2, 2024);

        verify(pagoRepository).findByFechaPagoBetween(LocalDate.of(2024, 2, 1), LocalDate.of(2024, 2, 29));
    }

    @Test
    void filtrarPagosPorFecha_soloConAnioBuscaElAnioCompleto() {
        when(pagoRepository.findByFechaPagoBetween(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31)))
                .thenReturn(List.of());

        pagoService.filtrarPagosPorFecha(null, null, 2025);

        verify(pagoRepository).findByFechaPagoBetween(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31));
    }

    @Test
    void guardarPago_exigeUnaCuota() {
        assertThatThrownBy(() -> pagoService.guardarPago(new Pago(), null))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void guardarPago_fallaSiLaCuotaNoExiste() {
        Pago pago = new Pago();
        Cuota cuota = new Cuota();
        cuota.setId(5L);
        pago.setCuota(cuota);
        when(cuotaRepository.findById(5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> pagoService.guardarPago(pago, null))
                .hasMessageContaining("no existe");
    }

    @Test
    void jugadoresYPagos_marcaQuienPagoYQuienDebe() {
        Jugador alDia = jugador(1L, "Juan");
        Jugador deudor = jugador(2L, "Pedro");
        Pago pago = new Pago();
        pago.setJugador(alDia);
        pago.setFechaPago(LocalDate.of(2025, 3, 10));

        when(jugadorRepository.findByCategoriaIdAndEstado(7L, EstadoJugador.ACTIVO)).thenReturn(List.of(alDia, deudor));
        when(pagoRepository.findByFechaPagoBetweenAndSocioIsNull(LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 31)))
                .thenReturn(List.of(pago));

        List<JugadorPagoDTO> estados = pagoService.obtenerJugadoresYPagos(7L, 3, 2025);

        assertThat(estados).extracting(JugadorPagoDTO::getEstado)
                .containsExactly("Pagó en fecha 2025-03-10", "Debe");
    }

    private Jugador jugador(Long id, String nombre) {
        Jugador jugador = new Jugador();
        jugador.setId(id);
        jugador.setNombre(nombre);
        return jugador;
    }
}
