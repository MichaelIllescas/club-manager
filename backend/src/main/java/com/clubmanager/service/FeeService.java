package com.clubmanager.service;

import com.clubmanager.exception.ResourceNotFoundException;

import com.clubmanager.entity.Fee;
import com.clubmanager.repository.FeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeeService {

    @Autowired
    private FeeRepository feeRepository;

    public Optional<Fee> save(Fee fee) {
        return Optional.of(feeRepository.save(fee));
    }

    public Optional<Fee> findById(Long id) {
        return feeRepository.findById(id);
    }

    public void deleteById(Long id) {
        if (feeRepository.existsById(id)) {
            feeRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("La cuota con el ID " + id + " no existe.");
        }
    }

    public List<Fee> findAll() {
        return feeRepository.findAll();
    }

    public Optional<Fee> update(Long id, Fee fee) {
        return feeRepository.findById(id).map(existingFee -> {
            existingFee.setName(fee.getName());
            existingFee.setAmount(fee.getAmount());
            existingFee.setLastUpdated(fee.getLastUpdated());
            return feeRepository.save(existingFee);
        });
    }
}
