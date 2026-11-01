package com.clubmanager.repository;

import com.clubmanager.entity.EstadoJugador;
import com.clubmanager.entity.Jugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JugadorRepository extends JpaRepository<Jugador,Long> {

    public List<Jugador> findByEstado(EstadoJugador estado);

    public Jugador findByDni(String dni);

    List<Jugador> findByCategoriaIdAndEstado(Long categoriaId, EstadoJugador estado);

    List<Jugador> findByCategoriaId(Long categoriaId);
}
