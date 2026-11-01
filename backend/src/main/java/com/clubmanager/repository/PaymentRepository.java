package com.clubmanager.repository;

import com.clubmanager.dto.MonthlyRevenueDTO;
import com.clubmanager.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByPlayerId(Long playerId);

    List<Payment> findByFeeId(Long feeId);

    List<Payment> findByPaymentDateBetweenAndMemberIsNull(LocalDate start, LocalDate end);

    List<Payment> findByMemberId(Long id);

    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT new com.clubmanager.dto.MonthlyRevenueDTO(MONTH(p.paymentDate), SUM(p.amount)) " +
            "FROM Payment p " +
            "WHERE YEAR(p.paymentDate) = :year " +
            "GROUP BY MONTH(p.paymentDate) " +
            "ORDER BY MONTH(p.paymentDate)")
    List<MonthlyRevenueDTO> calculateRevenuesByYear(int year);

    @Query("SELECT SUM(p.amount) FROM Payment p")
    double sumTotalRevenue();

}