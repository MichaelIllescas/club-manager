package com.clubmanager.service;

import com.clubmanager.exception.InvalidValueException;

import com.clubmanager.dto.PlayerPaymentStatusDTO;
import com.clubmanager.dto.MonthlyRevenueDTO;
import com.clubmanager.dto.QuarterlyRevenueDTO;
import com.clubmanager.entity.Fee;
import com.clubmanager.entity.PlayerStatus;
import com.clubmanager.entity.Player;
import com.clubmanager.entity.Payment;
import com.clubmanager.repository.FeeRepository;
import com.clubmanager.repository.PlayerRepository;
import com.clubmanager.repository.PaymentRepository;
import com.clubmanager.repository.MemberRepository;
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
class PaymentServiceTest {

    @Mock private PaymentRepository paymentRepository;
    @Mock private MemberRepository memberRepository;
    @Mock private PlayerRepository playerRepository;
    @Mock private FeeRepository feeRepository;
    @Mock private UserService userService;

    private PaymentService paymentService;

    @BeforeEach
    void setUp() {
        paymentService = new PaymentService(paymentRepository, memberRepository, playerRepository, feeRepository, userService);
    }

    @Test
    void revenueByYear_fillsMonthsWithoutPaymentsWithZero() {
        when(paymentRepository.calculateRevenuesByYear(2025)).thenReturn(List.of(
                new MonthlyRevenueDTO(1, new BigDecimal("1000")),
                new MonthlyRevenueDTO(12, new BigDecimal("500"))));

        List<BigDecimal> months = paymentService.getRevenuesByYear(2025);

        assertThat(months).hasSize(12);
        assertThat(months.get(0)).isEqualByComparingTo("1000");
        assertThat(months.get(5)).isEqualByComparingTo("0");
        assertThat(months.get(11)).isEqualByComparingTo("500");
    }

    @Test
    void quarterlyRevenue_addsThreeMonthsEach() {
        when(paymentRepository.calculateRevenuesByYear(2025)).thenReturn(List.of(
                new MonthlyRevenueDTO(1, new BigDecimal("100")),
                new MonthlyRevenueDTO(3, new BigDecimal("200")),
                new MonthlyRevenueDTO(4, new BigDecimal("50")),
                new MonthlyRevenueDTO(10, new BigDecimal("70"))));

        List<QuarterlyRevenueDTO> quarters = paymentService.getQuarterlyRevenues(2025);

        assertThat(quarters).extracting(QuarterlyRevenueDTO::getAmount)
                .usingComparatorForType(BigDecimal::compareTo, BigDecimal.class)
                .containsExactly(new BigDecimal("300"), new BigDecimal("50"), BigDecimal.ZERO, new BigDecimal("70"));
    }

    @Test
    void filterPaymentsByDate_withMonthAndYearSearchesWholeMonth() {
        when(paymentRepository.findByPaymentDateBetween(LocalDate.of(2024, 2, 1), LocalDate.of(2024, 2, 29)))
                .thenReturn(List.of());

        paymentService.filterPaymentsByDate(null, 2, 2024);

        verify(paymentRepository).findByPaymentDateBetween(LocalDate.of(2024, 2, 1), LocalDate.of(2024, 2, 29));
    }

    @Test
    void filterPaymentsByDate_withOnlyYearSearchesWholeYear() {
        when(paymentRepository.findByPaymentDateBetween(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31)))
                .thenReturn(List.of());

        paymentService.filterPaymentsByDate(null, null, 2025);

        verify(paymentRepository).findByPaymentDateBetween(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31));
    }

    @Test
    void savePayment_requiresFee() {
        assertThatThrownBy(() -> paymentService.savePayment(new Payment()))
                .isInstanceOf(InvalidValueException.class);
    }

    @Test
    void savePayment_failsWhenFeeIsMissing() {
        Payment payment = new Payment();
        Fee fee = new Fee();
        fee.setId(5L);
        payment.setFee(fee);
        when(feeRepository.findById(5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> paymentService.savePayment(payment))
                .hasMessageContaining("no existe");
    }

    @Test
    void playersAndPayments_marksWhoPaidAndWhoOwes() {
        Player upToDate = player(1L, "Juan");
        Player debtor = player(2L, "Pedro");
        Payment payment = new Payment();
        payment.setPlayer(upToDate);
        payment.setPaymentDate(LocalDate.of(2025, 3, 10));

        when(playerRepository.findByCategoryIdAndStatus(7L, PlayerStatus.ACTIVE)).thenReturn(List.of(upToDate, debtor));
        when(paymentRepository.findByPaymentDateBetweenAndMemberIsNull(LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 31)))
                .thenReturn(List.of(payment));

        List<PlayerPaymentStatusDTO> statuses = paymentService.getPlayersAndPayments(7L, 3, 2025);

        assertThat(statuses).extracting(PlayerPaymentStatusDTO::getStatus)
                .containsExactly("Pagó en fecha 2025-03-10", "Debe");
    }

    private Player player(Long id, String firstName) {
        Player player = new Player();
        player.setId(id);
        player.setFirstName(firstName);
        return player;
    }
}
