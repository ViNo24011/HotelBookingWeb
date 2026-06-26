package com.example.ttcs_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRoomResponse {
    private Long id;
    private Long roomId;
    private String roomNumber;
    private String roomType;
    private BigDecimal priceAtBooking;
    private int numAdults;
    private int numChildren;
}
