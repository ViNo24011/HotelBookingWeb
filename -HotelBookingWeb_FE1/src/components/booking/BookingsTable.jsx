import { parseISO } from "date-fns"
import React, { useState, useEffect } from "react"
import DateSlider from "../common/DateSlider"

const BookingsTable = ({ bookingInfo, handleBookingCancellation, handleBookingCompletion }) => {
	const userRole = localStorage.getItem("userRole")
	const [filteredBookings, setFilteredBookings] = useState(bookingInfo)

	const filterBooknigs = (startDate, endDate) => {
		let filtered = bookingInfo
		if (startDate && endDate) {
			filtered = bookingInfo.filter((booking) => {
				const bookingStarDate = parseISO(booking.checkIn)
				const bookingEndDate = parseISO(booking.checkOut)
				return (
					bookingStarDate >= startDate && bookingEndDate <= endDate && bookingEndDate > startDate
				)
			})
		}
		setFilteredBookings(filtered)
	}

	useEffect(() => {
		setFilteredBookings(bookingInfo)
	}, [bookingInfo])

	return (
		<section className="p-4 bg-white shadow-sm rounded-4 mt-4">
			<div className="mb-4">
				<DateSlider onDateChange={filterBooknigs} onFilterChange={filterBooknigs} />
			</div>
			<div className="table-responsive">
				<table className="table table-hover align-middle">
					<thead>
						<tr className="text-center">
							<th>S/N</th>
							<th>Booking ID</th>
							<th>Rooms</th>
							<th>Check-In</th>
							<th>Check-Out</th>
							<th>Guest Name</th>
							<th>Guests</th>
							<th>Confirmation Code</th>
							<th>Total Amount</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody className="text-center">
						{filteredBookings.map((booking, index) => (
							<tr key={booking.id}>
								<td>{index + 1}</td>
								<td className="fw-bold">{booking.id}</td>
								<td>
									<ul className="list-unstyled mb-0 small text-start">
										{booking.bookedRooms && booking.bookedRooms.map((room, i) => (
											<li key={i} className="mb-1">
												<span className="badge bg-light text-dark border me-1">Room {room.roomNumber}</span>
												<span className="text-muted">{room.roomType}</span>
											</li>
										))}
									</ul>
								</td>
								<td>{booking.checkIn}</td>
								<td>{booking.checkOut}</td>
								<td>{booking.guestName}</td>
								<td>{booking.totalGuests}</td>
								<td><code className="bg-light p-1 rounded text-primary">{booking.confirmationCode}</code></td>
								<td className="hotel-color fw-bold">
									{booking.totalAmount ? booking.totalAmount.toLocaleString() : "0"} VNĐ
								</td>
								<td>
									<span className={`badge rounded-pill ${
										booking.status === "COMPLETED" ? "bg-success" : 
										booking.status === "CONFIRMED" ? "bg-primary" : 
										booking.status === "CANCELLED" ? "bg-danger" : "bg-warning"
									}`}>
										{booking.status}
									</span>
								</td>
								<td>
									<div className="d-flex gap-2 justify-content-center">
										{userRole === "ROLE_ADMIN" && booking.status !== "CANCELLED" && (
											<button
												className="btn btn-outline-danger btn-sm rounded-pill px-3"
												style={{ position: "relative", zIndex: 10 }}
												onClick={() => handleBookingCancellation(booking.id)}>
												Cancel
											</button>
										)}
										{userRole === "ROLE_ADMIN" && booking.status === "CONFIRMED" && (
											<button
												className="btn btn-outline-success btn-sm rounded-pill px-3"
												style={{ position: "relative", zIndex: 10 }}
												onClick={() => handleBookingCompletion(booking.id)}>
												Complete
											</button>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{filteredBookings.length === 0 && (
				<div className="alert alert-info text-center mt-3">
					No bookings found for the selected dates.
				</div>
			)}
		</section>
	)
}

export default BookingsTable
