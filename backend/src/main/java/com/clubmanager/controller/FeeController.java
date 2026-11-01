package com.clubmanager.controller;

import com.clubmanager.entity.Fee;
import com.clubmanager.service.FeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
public class FeeController {

    @Autowired
    private FeeService feeService;

    @PostMapping
    public ResponseEntity<Fee> createFee(@RequestBody Fee fee) {
        return feeService.save(fee)
                .map(savedFee -> ResponseEntity.status(HttpStatus.CREATED).body(savedFee))
                .orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fee> getFee(@PathVariable Long id) {
        return feeService.findById(id)
                .map(fee -> ResponseEntity.ok(fee))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> updateFee(@PathVariable Long id, @RequestBody Fee fee) {
        return feeService.update(id, fee)
                .map(updatedFee -> ResponseEntity.ok(updatedFee))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFee(@PathVariable Long id) {
        feeService.deleteById(id);
        return ResponseEntity.noContent().build();

    }

    @GetMapping
    public ResponseEntity<List<Fee>> getAllFees() {
        List<Fee> fees = feeService.findAll();
        return ResponseEntity.ok(fees);
    }
}
