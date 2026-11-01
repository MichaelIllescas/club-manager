package com.clubmanager.service;

import com.clubmanager.entity.PlayerStatus;
import com.clubmanager.entity.Player;
import com.clubmanager.exception.ResourceNotFoundException;
import com.clubmanager.repository.PlayerRepository;
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
class PlayerServiceTest {

    @Mock
    private PlayerRepository playerRepository;

    private PlayerService playerService;

    @BeforeEach
    void setUp() {
        playerService = new PlayerService(playerRepository);
    }

    @Test
    void createPlayer_setsRegistrationDateAndIsActive() {
        when(playerRepository.save(any(Player.class))).thenAnswer(inv -> inv.getArgument(0));

        Player created = playerService.createPlayer(new Player());

        assertThat(created.getRegistrationDate()).isEqualTo(LocalDate.now());
        assertThat(created.getStatus()).isEqualTo(PlayerStatus.ACTIVE);
    }

    @Test
    void updatePlayer_failsWhenMissing() {
        when(playerRepository.existsById(3L)).thenReturn(false);

        assertThatThrownBy(() -> playerService.updatePlayer(3L, new Player()))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(playerRepository, never()).save(any());
    }

    @Test
    void updatePlayer_keepsId() {
        when(playerRepository.existsById(3L)).thenReturn(true);
        when(playerRepository.save(any(Player.class))).thenAnswer(inv -> inv.getArgument(0));

        Player updated = playerService.updatePlayer(3L, new Player());

        assertThat(updated.getId()).isEqualTo(3L);
    }

    @Test
    void deactivateAndActivate_changeStatus() {
        Player player = new Player();
        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        playerService.deactivatePlayer(1L);
        assertThat(player.getStatus()).isEqualTo(PlayerStatus.INACTIVE);

        playerService.activatePlayer(1L);
        assertThat(player.getStatus()).isEqualTo(PlayerStatus.ACTIVE);
    }

    @Test
    void deactivatePlayer_setsDeactivationDate() {
        Player player = new Player();
        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        playerService.retirePlayer(1L);

        assertThat(player.getDeactivationDate()).isEqualTo(LocalDate.now());
    }
}
