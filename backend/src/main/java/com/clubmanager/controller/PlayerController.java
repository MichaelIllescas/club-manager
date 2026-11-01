package com.clubmanager.controller;

import com.clubmanager.exception.ResourceNotFoundException;

import com.clubmanager.dto.PlayerStatusDTO;
import com.clubmanager.dto.PlayerDTO;
import com.clubmanager.entity.Category;
import com.clubmanager.entity.Player;
import com.clubmanager.repository.CategoryRepository;
import com.clubmanager.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerService playerService;
    private final CategoryRepository   categoryRepository;

    @Autowired
    public PlayerController(PlayerService playerService, CategoryRepository categoryRepository) {
        this.playerService = playerService;
        this.categoryRepository = categoryRepository;
    }

    @PostMapping
    public ResponseEntity<Player> createPlayer(@RequestBody Player player) {
        Player newPlayer = playerService.createPlayer(player);
        return new ResponseEntity<>(newPlayer, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        return playerService.getPlayerById(id)
                .map(player -> ResponseEntity.ok(player))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping
    public ResponseEntity<List<PlayerDTO>> listPlayers() {
        List<PlayerDTO> players = playerService.getAllPlayers();
        return ResponseEntity.ok(players);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<?>> getPlayersByCategory(
            @PathVariable Long categoryId
    ) {
        List<PlayerDTO> players = playerService.findByCategoryId(categoryId);
        return ResponseEntity.ok(players);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlayer(@PathVariable Long id, @RequestBody PlayerDTO playerDTO) {
        Category category = (Category) categoryRepository.findByName(playerDTO.getCategory())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        Player player = playerService.getPlayerById(id)
                .orElseThrow(() -> new ResourceNotFoundException("El jugador con ID " + id + " no existe."));
        player.setFirstName(playerDTO.getFirstName());
        player.setLastName(playerDTO.getLastName());
        player.setDni(playerDTO.getDni());
        player.setPhone(playerDTO.getPhone());
        player.setEmail(playerDTO.getEmail());
        player.setCategory(category);

        playerService.createPlayer(player);

        return ResponseEntity.ok(player);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> retirePlayer(@PathVariable Long id) {
        playerService.retirePlayer(id);
        return ResponseEntity.noContent().build();

    }
    @GetMapping("/statuses")
    public ResponseEntity<List<PlayerStatusDTO>> getAllPlayers() {
        // With no players, return an empty list (200) instead of a 204 without a body
        return ResponseEntity.ok(playerService.getPlayerStatuses());
    }
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<String> deactivatePlayer(@PathVariable Long id) {
        playerService.deactivatePlayer(id);
        return ResponseEntity.ok("Jugador deshabilitado con éxito");

    }
    @PutMapping("/{id}/activate")
    public ResponseEntity<String> activatePlayer(@PathVariable Long id) {
        playerService.activatePlayer(id);
        return ResponseEntity.ok("Jugador habilitado con éxito");

    }

}