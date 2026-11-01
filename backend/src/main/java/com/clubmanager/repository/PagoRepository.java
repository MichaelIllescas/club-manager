package com.clubmanager.repository;


import com.clubmanager.dto.RecaudacionMensualDTO;
import com.clubmanager.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {

    // Buscar pagos por jugador
    List<Pago> findByJugadorId(Long jugadorId);

    // Buscar pagos por socio
   // List<Pago> findBySocioId(Long socioId);

    // Buscar pagos por cuota
    List<Pago> findByCuotaId(Long cuotaId);

    // Buscar pagos entre fechas específicas
    List<Pago> findByFechaPagoBetweenAndSocioIsNull(LocalDate inicio, LocalDate fin);

    List<Pago> findBySocioId(Long id);

    List<Pago> findByFechaPagoBetween(LocalDate fechaInicio, LocalDate fechaFin);

    @Query("SELECT new com.clubmanager.dto.RecaudacionMensualDTO(MONTH(p.fechaPago), SUM(p.monto)) " +
            "FROM Pago p " +
            "WHERE YEAR(p.fechaPago) = :anio " +
            "GROUP BY MONTH(p.fechaPago) " +
            "ORDER BY MONTH(p.fechaPago)")
    List<RecaudacionMensualDTO> calcularRecaudacionesPorAnio(int anio);

    @Query("SELECT SUM(p.monto) FROM Pago p")
    double sumRecaudacionTotal();


}