package com.clubmanager.service;

import com.clubmanager.dto.DashboardDTO;
import com.clubmanager.dto.MonthlyRevenueDTO;
import com.clubmanager.repository.CategoryRepository;
import com.clubmanager.repository.PlayerRepository;
import com.clubmanager.service.PaymentService;
import com.clubmanager.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    private final PlayerRepository playerRepository;
    private final MemberRepository memberRepository;
    private final PaymentService paymentService;
    private final CategoryRepository categoryRepository;

    public DashboardService(PlayerRepository playerRepository,
                            MemberRepository memberRepository,
                            PaymentService paymentService,
                            CategoryRepository categoryRepository) {
        this.playerRepository = playerRepository;
        this.memberRepository = memberRepository;
      this.paymentService = paymentService;
        this.categoryRepository = categoryRepository;
    }

    public DashboardDTO getDashboardData() {
        DashboardDTO dto = new DashboardDTO();

        dto.setPlayerCount(playerRepository.count());

        dto.setMemberCount(memberRepository.count());

        List<BigDecimal> revenues= paymentService.getMonthlyRevenues(LocalDate.now().getYear());
        BigDecimal total = BigDecimal.ZERO;

        for (BigDecimal revenue : revenues) {
            total = total.add(revenue);
        }

        dto.setTotalRevenue(total);

        dto.setActiveCategories((int) categoryRepository.count());

        // Monthly revenue for the chart
        List<BigDecimal> chartData = paymentService.getMonthlyRevenues(LocalDate.now().getYear());
        dto.setChartData(chartData);

        return dto;
    }
}
