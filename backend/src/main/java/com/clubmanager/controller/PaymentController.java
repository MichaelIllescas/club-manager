package com.clubmanager.controller;

import com.clubmanager.dto.PlayerPaymentStatusDTO;
import com.clubmanager.dto.PaymentDTO;
import com.clubmanager.dto.PaymentDetailDTO;
import com.clubmanager.entity.Payment;
import com.clubmanager.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<?> registerPayment(@RequestBody Payment payment) {
        PaymentDetailDTO newPayment = paymentService.savePayment(payment);
        return ResponseEntity.ok(newPayment);

    }

    @GetMapping("/status")
    public ResponseEntity<List<PlayerPaymentStatusDTO>> getPaymentStatus(
            @RequestParam Long categoryId,
            @RequestParam Integer month,
            @RequestParam Integer year
    ) {
        List<PlayerPaymentStatusDTO> playersAndPayments = paymentService.getPlayersAndPayments(categoryId, month, year);
        return ResponseEntity.ok(playersAndPayments);
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<PaymentDetailDTO>> listPaymentsByPlayer(@PathVariable Long playerId) {
        return ResponseEntity.ok(paymentService.getPaymentsByPlayer(playerId));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<PaymentDetailDTO>> listPaymentsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(paymentService.getPaymentsByMember(memberId));
    }

    @GetMapping("/by-dates")
    public ResponseEntity<List<PaymentDTO>> listPaymentsByDates(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {
        return ResponseEntity.ok(paymentService.getPaymentsByDates(start, end));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/people")
    public ResponseEntity<List<?>> people() {
        return ResponseEntity.ok(paymentService.getActiveMembersAndPlayers());
    }

    @GetMapping("/details")
    public ResponseEntity<List<PaymentDetailDTO>> details() {
        return ResponseEntity.ok(paymentService.getAllPaymentDetails());
    }
    @GetMapping("/by-period")
    public ResponseEntity<List<PaymentDetailDTO>> getPaymentsByPeriod(
            @RequestParam(required = false) Integer day,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        List<PaymentDetailDTO> payments = paymentService.filterPaymentsByDate(day, month, year);
        return ResponseEntity.ok(payments);
    }

}
