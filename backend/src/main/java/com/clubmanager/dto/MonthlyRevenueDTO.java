package com.clubmanager.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class MonthlyRevenueDTO {
    private int month;
    private BigDecimal amount;

    public MonthlyRevenueDTO(int month, BigDecimal amount) {
        this.month = month;
        this.amount = amount;
    }

}
