package com.clubmanager.service;

import com.clubmanager.exception.ResourceNotFoundException;

import com.clubmanager.exception.InvalidValueException;

import com.clubmanager.dto.*;
import com.clubmanager.entity.*;
import com.clubmanager.repository.FeeRepository;
import com.clubmanager.repository.PlayerRepository;
import com.clubmanager.repository.PaymentRepository;
import com.clubmanager.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;
    private final PlayerRepository playerRepository;
    private final FeeRepository feeRepository;
    private final UserService userService;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, MemberRepository memberRepository, PlayerRepository playerRepository, FeeRepository feeRepository, UserService userService) {
        this.paymentRepository = paymentRepository;
        this.memberRepository = memberRepository;
        this.playerRepository = playerRepository;
        this.feeRepository = feeRepository;
        this.userService = userService;
    }

    public PaymentDetailDTO savePayment(Payment payment) {
        if (payment.getFee() == null || payment.getFee().getId() == null) {
            throw new InvalidValueException("El pago tiene que indicar una cuota.");
        }

        Fee fee = feeRepository.findById(payment.getFee().getId())
                .orElseThrow(() -> new ResourceNotFoundException("La cuota especificada no existe."));
        payment.setFee(fee);

        if (payment.getPlayer() != null && payment.getPlayer().getId() != null) {
            Player player = playerRepository.findById(payment.getPlayer().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("El jugador especificado no existe."));
            payment.setPlayer(player);
        }

        if (payment.getMember() != null && payment.getMember().getId() != null) {
            Member member = memberRepository.findById(payment.getMember().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("El socio especificado no existe."));
            payment.setMember(member);
        }

        payment.setRegistrationDate(LocalDate.now());
        User currentUser = userService.getCurrentUser();
        payment.setUser(currentUser);

         paymentRepository.save(payment);
         PaymentDetailDTO paymentDetailDTO = this.toPaymentDetailDTO(payment);
         return  paymentDetailDTO;
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::toPaymentDTO)
                .collect(Collectors.toList());
    }

    public PaymentDTO toPaymentDTO(Payment payment) {
        return new PaymentDTO(
                payment.getId(),
                payment.getPaymentDate(),
                payment.getAmount(),
                payment.getDescription(),
                payment.getFee().getId(),
                payment.getPlayer() != null ? payment.getPlayer().getId() : null,
                payment.getMember() != null ? payment.getMember().getId() : null,
                payment.getUser().getFirstName() + ' ' + payment.getUser().getLastName()
        );
    }

    public PaymentDetailDTO toPaymentDetailDTO(Payment payment) {
        return new PaymentDetailDTO(
                payment.getId(),
                payment.getPlayer() != null ? payment.getPlayer().getFirstName() : payment.getMember().getFirstName(),
                payment.getPlayer() != null ? payment.getPlayer().getLastName() : payment.getMember().getLastName(),
                payment.getPlayer() != null ? payment.getPlayer().getDni() : payment.getMember().getDni(),
                payment.getPlayer() != null ? payment.getPlayer().getCategory().getName() : "",
                payment.getPaymentDate().toString(),
                payment.getAmount(),
                payment.getDescription(),
                payment.getFee().getName(),
                payment.getUser().getFirstName() + ' ' + payment.getUser().getLastName()
        );
    }

    public List<PaymentDetailDTO> getPaymentsByPlayer(Long playerId) {
        return paymentRepository.findByPlayerId(playerId)
                .stream()
                .map(this::toPaymentDetailDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDetailDTO> getPaymentsByMember(Long memberId) {
        return paymentRepository.findByMemberId(memberId)
                .stream()
                .map(this::toPaymentDetailDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsByDates(LocalDate start, LocalDate end) {
        return paymentRepository.findByPaymentDateBetweenAndMemberIsNull(start, end)
                .stream()
                .map(this::toPaymentDTO)
                .collect(Collectors.toList());
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    public List<PersonDTO> getActiveMembersAndPlayers() {
        List<PersonDTO> people = new ArrayList<>();
        playerRepository.findByStatus(PlayerStatus.ACTIVE).forEach(player -> people.add(
                new PersonDTO(player.getId(), player.getFirstName(), player.getLastName(), player.getDni(), "player")
        ));
        memberRepository.findAllByStatus(Member.MemberStatus.ACTIVE).forEach(member -> people.add(
                new PersonDTO(member.getId(), member.getFirstName(), member.getLastName(), member.getDni(), "member")
        ));
        return people;
    }

    public List<PaymentDetailDTO> getAllPaymentDetails() {
        return paymentRepository.findAll()
                .stream()
                .map(this::toPaymentDetailDTO)
                .collect(Collectors.toList());
    }

    public List<PlayerPaymentStatusDTO> getPlayersAndPayments(Long categoryId, Integer month, Integer year) {
        LocalDate startDate = null;
        LocalDate endDate = null;

        if (month != null && year != null) {
            startDate = LocalDate.of(year, month, 1);
            endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        }

        List<Player> players = playerRepository.findByCategoryIdAndStatus(categoryId, PlayerStatus.ACTIVE);

        List<Payment> payments = paymentRepository.findByPaymentDateBetweenAndMemberIsNull(startDate, endDate);

        return players.stream().map(player -> {
            Payment payment = payments.stream()
                    .filter(p -> p.getPlayer().getId().equals(player.getId()))
                    .findFirst()
                    .orElse(null);

            String status = (payment != null) ? "Pagó en fecha " + payment.getPaymentDate() : "Debe";
            return new PlayerPaymentStatusDTO(player.getFirstName(), player.getLastName(), player.getDni(), status);
        }).collect(Collectors.toList());
    }

    public List<PaymentDetailDTO> filterPaymentsByDate(Integer day, Integer month, Integer year) {
        LocalDate startDate = null;
        LocalDate endDate = null;

        if (year != null) {
            if (month != null) {
                if (day != null) {
                    startDate = LocalDate.of(year, month, day);
                    endDate = startDate;
                } else {
                    startDate = LocalDate.of(year, month, 1);
                    endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
                }
            } else {
                startDate = LocalDate.of(year, 1, 1);
                endDate = LocalDate.of(year, 12, 31);
            }
        }

        if (startDate != null && endDate != null) {
            return paymentRepository.findByPaymentDateBetween(startDate, endDate).stream()
                    .map(this::toPaymentDetailDTO)
                    .collect(Collectors.toList());
        }

        return paymentRepository.findAll().stream().map(this::toPaymentDetailDTO).collect(Collectors.toList());

    }

    public List<BigDecimal> getRevenuesByYear(int year) {
        List<MonthlyRevenueDTO> results = paymentRepository.calculateRevenuesByYear(year);

        List<BigDecimal> revenues = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            revenues.add(BigDecimal.ZERO);
        }

        for (MonthlyRevenueDTO result : results) {
            revenues.set(result.getMonth() - 1, result.getAmount());
        }

        return revenues;
    }

    public List<BigDecimal> getMonthlyRevenues(int year) {
        List<BigDecimal> monthlyRevenues = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            monthlyRevenues.add(BigDecimal.ZERO);
        }

        List<MonthlyRevenueDTO> results = paymentRepository.calculateRevenuesByYear(year);

        for (MonthlyRevenueDTO result : results) {
            int month = result.getMonth();
            BigDecimal total = result.getAmount();
            monthlyRevenues.set(month - 1, total);
        }

        return monthlyRevenues;
    }

    public List<QuarterlyRevenueDTO> getQuarterlyRevenues(int year) {
        List<BigDecimal> monthlyRevenues = getMonthlyRevenues(year);

        List<QuarterlyRevenueDTO> quarterlyRevenues = new ArrayList<>();
        quarterlyRevenues.add(new QuarterlyRevenueDTO("Q1 (Ene-Mar)",
                monthlyRevenues.subList(0, 3).stream().reduce(BigDecimal.ZERO, BigDecimal::add)));
        quarterlyRevenues.add(new QuarterlyRevenueDTO("Q2 (Abr-Jun)",
                monthlyRevenues.subList(3, 6).stream().reduce(BigDecimal.ZERO, BigDecimal::add)));
        quarterlyRevenues.add(new QuarterlyRevenueDTO("Q3 (Jul-Sep)",
                monthlyRevenues.subList(6, 9).stream().reduce(BigDecimal.ZERO, BigDecimal::add)));
        quarterlyRevenues.add(new QuarterlyRevenueDTO("Q4 (Oct-Dic)",
                monthlyRevenues.subList(9, 12).stream().reduce(BigDecimal.ZERO, BigDecimal::add)));

        return quarterlyRevenues;
    }

}
