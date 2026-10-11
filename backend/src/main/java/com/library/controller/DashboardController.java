package com.library.controller;

import com.library.dto.ApiResponse;
import com.library.dto.DashboardStats;
import com.library.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardData() {
        DashboardStats stats = dashboardService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard data loaded successfully", stats));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentDashboardData(@PathVariable Long studentId) {
        Map<String, Object> stats = dashboardService.getStudentDashboardStats(studentId);
        return ResponseEntity.ok(ApiResponse.ok("Student dashboard metrics loaded", stats));
    }
}
