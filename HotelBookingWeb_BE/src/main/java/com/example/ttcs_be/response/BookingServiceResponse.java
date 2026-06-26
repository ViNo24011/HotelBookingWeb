package com.example.ttcs_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingServiceResponse {
    private Long id;
    private String serviceName;
    private int quantity;
    private BigDecimal priceAtTime;
    private boolean isFree;
}