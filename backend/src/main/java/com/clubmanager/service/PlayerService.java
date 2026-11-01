package com.clubmanager.service;

import com.clubmanager.exception.ResourceNotFoundException;

import com.clubmanager.dto.PlayerStatusDTO;
import com.clubmanager.dto.PlayerDTO;
import com.clubmanager.entity.PlayerStatus;
import com.clubmanager.entity.Player;
import com.clubmanager.repository.PlayerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public Player createPlayer(Player player) {
        player.setRegistrationDate(LocalDate.now());
        return playerRepository.save(player);
    }

    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }

    public List<PlayerDTO> getAllPlayers() {
        List<Player> players = playerRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return players.stream()
                .map(player -> new PlayerDTO(
                        player.getId(),
                        player.getFirstName(),
                        player.getLastName(),
                        player.getDni(),
                        player.getPhone(),
                        player.getEmail(),
                        player.getRegistrationDate().format(formatter),
                        player.getCategory().getName(),
                        player.getStatus().name()
                ))
                .collect(Collectors.toList());
    }

    public Player updatePlayer(Long id, Player updatedPlayer) {
        if (!playerRepository.existsById(id)) {
            throw new ResourceNotFoundException("El jugador con ID " + id + " no existe.");
        }
        updatedPlayer.setId(id);
        return playerRepository.save(updatedPlayer);
    }

    public void retirePlayer(Long id) {
        playerRepository.findById(id).ifPresentOrElse(player -> {
            player.setDeactivationDate(LocalDate.now());
            playerRepository.save(player);
        }, () -> {
            throw new ResourceNotFoundException("El jugador con ID " + id + " no existe.");
        });
    }

    public List<PlayerStatusDTO> getPlayerStatuses() {
        List<Player> players = playerRepository.findAll();
        return players.stream()
                .map(this::toPlayerStatusDTO)
                .collect(Collectors.toList());
    }

    private PlayerStatusDTO toPlayerStatusDTO(Player player) {
        return new PlayerStatusDTO(
                player.getId(),
                player.getFirstName(),
                player.getLastName(),
                player.getDni(),
                player.getStatus().name()
        );
    }
    private PlayerDTO toPlayerDTO(Player player) {
        return new PlayerDTO(
                player.getId(),
                player.getFirstName(),
                player.getLastName(),
                player.getDni(),
                player.getPhone(),
                player.getEmail(),
                player.getRegistrationDate().toString(),
                player.getCategory().getName(),
                player.getStatus().name()
        );
    }

    public List<Player> getActivePlayers() {
        return playerRepository.findByStatus(PlayerStatus.ACTIVE);
    }

    @Transactional
    public void deactivatePlayer(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado"));
        player.deactivate();
        playerRepository.save(player);
    }
    public void activatePlayer(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado"));
        player.activate();
        playerRepository.save(player);
    }

    public List<PlayerDTO> findByCategoryId(Long categoryId) {
         return playerRepository.findByCategoryId( categoryId).stream()
                 .map(this :: toPlayerDTO ).
                 collect(Collectors.toList());
    }
}
