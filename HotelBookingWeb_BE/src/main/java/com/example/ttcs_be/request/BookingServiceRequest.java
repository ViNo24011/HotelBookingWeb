package com.example.ttcs_be.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingServiceRequest {
    private Long serviceId;
    private int quantity;
}