package com.clubmanager.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class QuarterlyRevenueDTO {
    private String quarter;
    private BigDecimal amount;

    public QuarterlyRevenueDTO(String quarter, BigDecimal amount) {
        this.quarter = quarter;
        this.amount = amount;
    }
}