package com.clubmanager.repository;

import com.clubmanager.entity.PlayerStatus;
import com.clubmanager.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player,Long> {

    public List<Player> findByStatus(PlayerStatus status);

    public Player findByDni(String dni);

    List<Player> findByCategoryIdAndStatus(Long categoryId, PlayerStatus status);

    List<Player> findByCategoryId(Long categoryId);
}
