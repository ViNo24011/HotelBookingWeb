package com.example.ttcs_be.service;

import com.example.ttcs_be.model.User;
import com.example.ttcs_be.request.BookingRequest;
import com.example.ttcs_be.request.BookingRoomRequest;
import com.example.ttcs_be.exception.InvalidBookingRequestException;
import com.example.ttcs_be.exception.ResourceNotFoundException;
import com.example.ttcs_be.model.Booking;
import com.example.ttcs_be.model.BookingRoom;
import com.example.ttcs_be.model.Room;
import com.example.ttcs_be.repository.BookingRepository;
import com.example.ttcs_be.repository.RoomRepository;
import com.example.ttcs_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements IBookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final com.example.ttcs_be.repository.ServiceRepository serviceRepository;
    private final com.example.ttcs_be.service.EmailService emailService;

    @Override
    @Transactional
    public String saveBooking(BookingRequest bookingRequest) {
        // 1. Kiểm tra ngày hợp lệ cơ bản
        if (!bookingRequest.getCheckOut().isAfter(bookingRequest.getCheckIn())) {
            throw new InvalidBookingRequestException("Ngày trả phòng phải diễn ra sau ngày nhận phòng ít nhất 1 ngày!");
        }

        String confirmationCode = RandomStringUtils.randomNumeric(10);
        System.out.println("DEBUG: Creating booking with confirmationCode: " + confirmationCode);
        
        Booking booking = new Booking();
        if (bookingRequest.getUserId() != null) {
            booking.setUser(userRepository.findById(bookingRequest.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + bookingRequest.getUserId())));
            booking.setGuestEmail(booking.getUser().getEmail());
        }

        booking.setCheckIn(bookingRequest.getCheckIn());
        booking.setCheckOut(bookingRequest.getCheckOut());
        booking.setGuestName(bookingRequest.getGuestName());
        booking.setConfirmationCode(confirmationCode);

        long numberOfNights = ChronoUnit.DAYS.between(bookingRequest.getCheckIn(), bookingRequest.getCheckOut());

        BigDecimal totalAmount = BigDecimal.ZERO;
        int totalGuests = 0;
        int totalCapacity = 0;
        List<BookingRoom> bookingRooms = new ArrayList<>();

        // 2. Lấy danh sách TẤT CẢ các phòng đang trống trong khoảng thời gian này
        List<Room> availableRooms = roomRepository.findAvailableRoomsByDatesAndType(
                bookingRequest.getCheckIn(),
                bookingRequest.getCheckOut(),
                null // Bỏ qua phân loại, lấy tất cả phòng trống
        );

        // 3. Duyệt qua Giỏ hàng và Kiểm tra Overbooking
        boolean isFirstRoom = true;
        for (BookingRoomRequest roomReq : bookingRequest.getSelectedRooms()) {

            // KIỂM TRA OVERBOOKING: Phòng khách chọn có nằm trong danh sách phòng trống không?
            boolean isRoomAvailable = availableRooms.stream()
                    .anyMatch(r -> r.getId().equals(roomReq.getRoomId()));

            if (!isRoomAvailable) {

                throw new InvalidBookingRequestException("Rất tiếc! Phòng số ID " + roomReq.getRoomId() + " đã có người đặt trước trong khoảng thời gian này!");
            }

            // Nếu trống, tiếp tục tìm phòng để tính tiền
            Room room = roomRepository.findById(roomReq.getRoomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng với ID: " + roomReq.getRoomId()));

            totalCapacity += room.getRoomType().getMaxCapacity();

            BigDecimal roomPriceForStay = room.getRoomType().getBasePrice().multiply(BigDecimal.valueOf(numberOfNights));
            totalAmount = totalAmount.add(roomPriceForStay);

            BookingRoom bookingRoom = new BookingRoom();
            bookingRoom.setRoom(room);
            bookingRoom.setBooking(booking);
            bookingRoom.setPriceAtBooking(room.getRoomType().getBasePrice());
            
            if (isFirstRoom) {
                int guestsInRoom = roomReq.getNumAdults() + roomReq.getNumChildren();
                if (guestsInRoom < 0) {
                    throw new InvalidBookingRequestException("Số lượng khách không được nhỏ hơn 0!");
                }
                totalGuests = guestsInRoom;
                bookingRoom.setNumAdults(roomReq.getNumAdults());
                bookingRoom.setNumChildren(roomReq.getNumChildren());
                isFirstRoom = false;
            } else {
                bookingRoom.setNumAdults(0);
                bookingRoom.setNumChildren(0);
            }

            bookingRooms.add(bookingRoom);
        }

        if (totalGuests > totalCapacity) {
            throw new InvalidBookingRequestException("Lỗi: Số lượng khách (" + totalGuests + ") đã vượt quá tổng sức chứa tối đa của các phòng đã chọn (" + totalCapacity + " người)!");
        }

        java.util.Set<Long> freeServiceIds = new java.util.HashSet<>();
        for (BookingRoom br : bookingRooms) {
            if (br.getRoom().getRoomType().getFreeServices() != null) {
                for (com.example.ttcs_be.model.Service freeService : br.getRoom().getRoomType().getFreeServices()) {
                    // Dùng HashSet để tránh tặng trùng 1 dịch vụ nếu khách đặt 2 phòng cùng loại
                    if (!freeServiceIds.contains(freeService.getId())) {
                        com.example.ttcs_be.model.BookingService bs = new com.example.ttcs_be.model.BookingService();
                        bs.setService(freeService);
                        bs.setQuantity(1); // Tặng 1 gói miễn phí theo phòng
                        bs.setPriceAtTime(BigDecimal.ZERO); // GIÁ = 0 (QUÀ TẶNG)

                        booking.addBookingService(bs);
                        freeServiceIds.add(freeService.getId());
                    }
                }
            }
        }

        // 2. TÍNH TIỀN CÁC DỊCH VỤ KHÁCH MUA THÊM
        if (bookingRequest.getSelectedServices() != null && !bookingRequest.getSelectedServices().isEmpty()) {
            for (com.example.ttcs_be.request.BookingServiceRequest serviceReq : bookingRequest.getSelectedServices()) {
                if (serviceReq.getQuantity() <= 0) {
                    throw new InvalidBookingRequestException("Số lượng dịch vụ phải lớn hơn 0!");
                }
                com.example.ttcs_be.model.Service extraService = serviceRepository.findById(serviceReq.getServiceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dịch vụ ID: " + serviceReq.getServiceId()));

                com.example.ttcs_be.model.BookingService bs = new com.example.ttcs_be.model.BookingService();
                bs.setService(extraService);
                bs.setQuantity(serviceReq.getQuantity());
                bs.setPriceAtTime(extraService.getPrice()); // LẤY GIÁ GỐC TỪ DB

                booking.addBookingService(bs);

                // Cộng tiền dịch vụ vào tổng hóa đơn
                BigDecimal serviceTotal = extraService.getPrice().multiply(BigDecimal.valueOf(serviceReq.getQuantity()));
                totalAmount = totalAmount.add(serviceTotal);
            }
        }

        int pointsUsed = 0;
        BigDecimal discountAmount = BigDecimal.ZERO;

        // Nếu khách chọn dùng điểm VÀ ví điểm của khách > 0
        Integer userPoints = booking.getUser().getLoyaltyPoints();
        if (bookingRequest.isUsePoints() && userPoints != null && userPoints > 0) {
            int availablePoints = userPoints;
            BigDecimal pointsValue = new BigDecimal(availablePoints); // 1 Điểm = 1 Đơn vị tiền

            if (pointsValue.compareTo(totalAmount) >= 0) {

                discountAmount = totalAmount;
                pointsUsed = totalAmount.intValue();
                totalAmount = BigDecimal.ZERO;
            } else {

                discountAmount = pointsValue;
                pointsUsed = availablePoints;
                totalAmount = totalAmount.subtract(discountAmount);
            }

            // Trừ điểm thẳng vào ví của User ngay lập tức
            booking.getUser().setLoyaltyPoints(availablePoints - pointsUsed);
            userRepository.save(booking.getUser());
        }

        // Lưu vết lại vào Booking
        booking.setPointsUsed(pointsUsed);
        booking.setDiscountAmount(discountAmount);

        // TÍNH ĐIỂM SẼ ĐƯỢC NHẬN (5% của số tiền THỰC TRẢ)
        // Chưa cộng ngay! Chỉ lưu vào hóa đơn để đó.
        int pointsEarned = totalAmount.multiply(new BigDecimal("0.05")).intValue();
        booking.setPointsEarned(pointsEarned);
        
        // KIỂM TRA TRẠNG THÁI: Nếu thanh toán toàn bộ bằng điểm (Tổng tiền = 0), duyệt đơn luôn
        if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
            booking.setStatus("CONFIRMED");
        } else {
            booking.setStatus("PENDING");
        }


        // 4. Chốt đơn
        booking.setTotalAmount(totalAmount);
        booking.setTotalGuests(totalGuests);
        booking.setBookingRooms(bookingRooms);

        bookingRepository.saveAndFlush(booking);

        return confirmationCode;
    }

    @Transactional
    @Override
    public void completeBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt phòng!"));

        // Chỉ đơn hàng đã thanh toán (CONFIRMED) mới được chuyển sang Hoàn thành
        if (!"CONFIRMED".equals(booking.getStatus())) {
            throw new RuntimeException("Chỉ có thể hoàn thành đơn hàng đang ở trạng thái CONFIRMED (Đã thanh toán)!");
        }

        booking.setStatus("COMPLETED");

        // CỘNG ĐIỂM THƯỞNG CHO USER (5% đã tính toán lúc đặt)
        // Kiểm tra để tránh cộng điểm 2 lần (nếu cron job và Admin bấm cùng lúc)
        if (booking.getPointsEarned() > 0) {
            User user = booking.getUser();
            int currentPoints = user.getLoyaltyPoints() != null ? user.getLoyaltyPoints() : 0;
            user.setLoyaltyPoints(currentPoints + booking.getPointsEarned());
            booking.setPointsEarned(0); // Reset về 0 để đánh dấu đã cộng rồi
            userRepository.save(user);
        }

        bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking getBookingByConfirmationCode(String confirmationCode) {
        return bookingRepository.findByConfirmationCode(confirmationCode)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt phòng với mã: " + confirmationCode));
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt phòng!"));

        if ("COMPLETED".equals(booking.getStatus())) {
            throw new RuntimeException("Không thể hủy đơn hàng đã hoàn thành!");
        }

        // NẾU LÚC ĐẶT KHÁCH CÓ XÀI ĐIỂM -> HOÀN LẠI VÀO VÍ
        if (booking.getPointsUsed() > 0) {
            User user = booking.getUser();
            int currentPoints = user.getLoyaltyPoints() != null ? user.getLoyaltyPoints() : 0;
            user.setLoyaltyPoints(currentPoints + booking.getPointsUsed());
            userRepository.save(user);
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }


    @Scheduled(cron = "0 0 1 * * ?") //  Tự động kích hoạt vào lúc 1:00 SÁNG MỖI NGÀY
    @Transactional
    public void autoCompleteBookings() {
        // 1. Lấy mốc thời gian hôm nay
        java.time.LocalDate today = java.time.LocalDate.now();

        // 2. Tìm tất cả các đơn "Đã thanh toán" (CONFIRMED) và ngày Check-out đã qua (nhỏ hơn hôm nay)
        List<Booking> bookingsToComplete = bookingRepository.findByStatusAndCheckOutLessThan("CONFIRMED", today);

        if (bookingsToComplete.isEmpty()) {
            return; // Không có đơn nào thì thôi, đi ngủ tiếp
        }

        // 3. Quét từng đơn và thực hiện "Chốt hạ"
        for (Booking booking : bookingsToComplete) {
            // Đổi trạng thái
            booking.setStatus("COMPLETED");

            // CỘNG ĐIỂM THƯỞNG 5% VÀO VÍ USER (chỉ cộng nếu chưa cộng trước đó)
            if (booking.getPointsEarned() > 0) {
                com.example.ttcs_be.model.User user = booking.getUser();
                int currentPoints = user.getLoyaltyPoints() != null ? user.getLoyaltyPoints() : 0;
                user.setLoyaltyPoints(currentPoints + booking.getPointsEarned());
                booking.setPointsEarned(0); // Reset về 0 để đánh dấu đã cộng rồi
                userRepository.save(user); // Lưu User
            }
        }

        // 4. Lưu lại toàn bộ đơn hàng đã cập nhật trạng thái
        bookingRepository.saveAll(bookingsToComplete);

        // In ra console để sáng hôm sau Admin biết hệ thống ngầm đã làm việc
        System.out.println("[CRON JOB] Đã tự động hoàn thành và cộng điểm cho " + bookingsToComplete.size() + " đơn đặt phòng lúc 1h sáng.");
    }

    @Scheduled(cron = "0 */30 * * * ?") // Chạy mỗi 30 phút một lần
    @Transactional
    public void deleteAbandonedBookings() {
        java.time.LocalDateTime mốc_thời_gian = java.time.LocalDateTime.now().minusMinutes(30);
        List<Booking> abandoned = bookingRepository.findAll().stream()
                .filter(b -> "PENDING".equals(b.getStatus()) && b.getCreatedAt().isBefore(mốc_thời_gian))
                .collect(java.util.stream.Collectors.toList());

        if (!abandoned.isEmpty()) {
            bookingRepository.deleteAll(abandoned);
            System.out.println(" [CRON JOB] Đã xóa " + abandoned.size() + " đơn hàng PENDING quá hạn (30 phút).");
        }
    }

    @Scheduled(cron = "0 0 8 * * ?") // Kích hoạt vào 8:00 SÁNG MỖI NGÀY
    @Transactional(readOnly = true)
    public void sendCheckInReminders() {
        java.time.LocalDate tomorrow = java.time.LocalDate.now().plusDays(1);
        
        // Lấy danh sách các đơn đã thanh toán và có lịch nhận phòng vào ngày mai
        List<Booking> bookings = bookingRepository.findByStatusAndCheckIn("CONFIRMED", tomorrow);
        
        for (Booking booking : bookings) {
            if (booking.getGuestEmail() != null) {
                emailService.sendCheckInReminderEmail(
                        booking.getGuestEmail(),
                        booking.getGuestName(),
                        booking.getConfirmationCode(),
                        booking.getCheckIn()
                );
            }
        }
        System.out.println("Đã tự động gửi " + bookings.size() + " email nhắc nhở nhận phòng.");
    }

    @Override
    public List<Booking> getBookingsByUserEmail(String email) {
        // Trả về danh sách đơn đặt phòng dựa trên email của khách, lọc bỏ các đơn PENDING
        return bookingRepository.findByUserEmail(email);
    }

    @Override
    @Transactional
    public void deleteBookingByConfirmationCode(String confirmationCode) {
        System.out.println("DEBUG: Attempting to delete booking with code: " + confirmationCode);
        bookingRepository.findByConfirmationCode(confirmationCode).ifPresentOrElse(
            booking -> {
                bookingRepository.delete(booking);
                bookingRepository.flush();
                System.out.println("DEBUG: Successfully deleted booking: " + confirmationCode);
            },
            () -> System.out.println("DEBUG: Booking with code " + confirmationCode + " not found, ignoring.")
        );
    }
    @Override
    public BigDecimal getTotalRevenue() {
        BigDecimal total = bookingRepository.calculateTotalRevenue();
        return total != null ? total : BigDecimal.ZERO; // Tránh lỗi null nếu chưa có đơn nào
    }

    @Override
    public long getTotalBookings() {
        return bookingRepository.countTotalBookings();
    }

    @Override
    public List<Object[]> getMonthlyStatistics() {
        return bookingRepository.getMonthlyStatistics();
    }

    @Override
    public List<Object[]> getRoomTypeStatistics() {
        return bookingRepository.getRoomTypeStatistics();
    }
}
