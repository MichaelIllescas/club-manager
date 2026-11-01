package com.clubmanager.repository;

import com.clubmanager.entity.Socio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocioRepository extends JpaRepository<Socio, Long> {

    public List<Socio> findAllByEstado(Socio.EstadoSocio estado);

    // Buscar por DNI o número de socio
    Optional<Socio> findByDni(String dni);
    Optional<Socio> findByNumeroSocio(String numeroSocio);

    // Consultas para verificar existencia (útiles para validaciones)
    boolean existsByDni(String dni);
    boolean existsByNumeroSocio(String numeroSocio);

    // Consultas para verificar existencia excluyendo un id (útiles al actualizar)
    boolean existsByDniAndIdNot(String dni, Long id);
    boolean existsByNumeroSocioAndIdNot(String numeroSocio, Long id);
}
