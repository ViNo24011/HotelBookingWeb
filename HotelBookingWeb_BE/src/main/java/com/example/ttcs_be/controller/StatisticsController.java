package com.example.ttcs_be.controller;

import com.example.ttcs_be.response.StatisticsResponse;
import com.example.ttcs_be.service.IBookingService;
import com.example.ttcs_be.service.IRoomService;
import com.example.ttcs_be.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/statistics")
public class StatisticsController {

    private final IBookingService bookingService;
    private final IRoomService roomService;
    private final IUserService userService;

    @GetMapping("/dashboard-summary")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<StatisticsResponse> getDashboardSummary() {
        StatisticsResponse response = new StatisticsResponse();
        response.setTotalRooms(roomService.countTotalRooms());
        response.setTotalBookings(bookingService.getTotalBookings());
        response.setTotalRevenue(bookingService.getTotalRevenue());
        response.setTotalUsers(userService.countTotalUsers());

        // Mapping monthly statistics (Month, Revenue, Count)
        List<Map<String, Object>> monthlyData = bookingService.getMonthlyStatistics().stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("month", "Month " + obj[0]); // Object[0] is Month
            map.put("revenue", obj[1]);          // Object[1] is Revenue
            map.put("count", obj[2]);            // Object[2] is Count
            return map;
        }).collect(Collectors.toList());
        response.setMonthlyData(monthlyData);

        // Mapping room type statistics (Type, Count)
        List<Map<String, Object>> roomTypeData = bookingService.getRoomTypeStatistics().stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", obj[0]);  // Object[0] is Room Type Name
            map.put("value", obj[1]); // Object[1] is Count
            return map;
        }).collect(Collectors.toList());
        response.setRoomTypeData(roomTypeData);

        return ResponseEntity.ok(response);
    }
}
