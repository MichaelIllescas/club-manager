package com.clubmanager.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class PaymentDTO {

    private Long id;
    private LocalDate paymentDate;
    private BigDecimal amount;
    private String description;
    private Long feeId;
    private Long playerId;
    private Long memberId;
    private String registeredBy;

    public PaymentDTO(Long id, LocalDate paymentDate, BigDecimal amount, String description, Long feeId, Long playerId, Long memberId, String registeredBy) {
        this.id = id;
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.description = description;
        this.feeId = feeId;
        this.playerId = playerId;
        this.memberId = memberId;
        this.registeredBy = registeredBy;
    }
}
