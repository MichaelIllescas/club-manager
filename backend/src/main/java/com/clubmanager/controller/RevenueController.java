package com.clubmanager.controller;

import com.clubmanager.dto.QuarterlyRevenueDTO;
import com.clubmanager.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/monthly")
    public List<BigDecimal> getMonthlyRevenues(@RequestParam int year) {
        return paymentService.getMonthlyRevenues(year);
    }

    @GetMapping("/quarterly")
    public List<QuarterlyRevenueDTO> getQuarterlyRevenues(@RequestParam int year) {
        return paymentService.getQuarterlyRevenues(year);
    }
}
