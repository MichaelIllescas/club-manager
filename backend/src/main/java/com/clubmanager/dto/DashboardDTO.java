package com.clubmanager.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDTO {
    private long playerCount;
    private long memberCount;
    private BigDecimal totalRevenue;
    private int activeCategories;
    private List<BigDecimal> chartData;

    public long getPlayerCount() {
        return playerCount;
    }

    public void setPlayerCount(long playerCount) {
        this.playerCount = playerCount;
    }

    public long getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(long memberCount) {
        this.memberCount = memberCount;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public int getActiveCategories() {
        return activeCategories;
    }

    public void setActiveCategories(int activeCategories) {
        this.activeCategories = activeCategories;
    }

    public List<BigDecimal> getChartData() {
        return chartData;
    }

    public void setChartData(List<BigDecimal> chartData) {
        this.chartData = chartData;
    }
}
