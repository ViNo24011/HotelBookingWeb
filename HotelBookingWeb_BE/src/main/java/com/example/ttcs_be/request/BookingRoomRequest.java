package com.example.ttcs_be.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRoomRequest {
    private Long roomId;
    private int numAdults;
    private int numChildren;
}
