package com.example.ttcs_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomTypeResponse {
    private Long id;
    private String name;
    private BigDecimal basePrice;
    private int maxCapacity;
    private String description;
    private String photo;

    private List<ServiceResponse> freeServices;
}