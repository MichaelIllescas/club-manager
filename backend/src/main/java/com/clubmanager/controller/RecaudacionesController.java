package com.clubmanager.controller;

import com.clubmanager.dto.RecaudacionTrimestralDTO;
import com.clubmanager.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/recaudaciones")
public class RecaudacionesController {

    @Autowired
    private PagoService pagoService;




    @GetMapping("/mensuales")
    public List<BigDecimal> obtenerRecaudacionesMensuales(@RequestParam int year) {
        return pagoService.obtenerRecaudacionesMensuales(year);
    }


    @GetMapping("/trimestrales")
    public List<RecaudacionTrimestralDTO> obtenerRecaudacionesTrimestrales(@RequestParam int year) {
        return pagoService.obtenerRecaudacionesTrimestrales(year);
    }
}
