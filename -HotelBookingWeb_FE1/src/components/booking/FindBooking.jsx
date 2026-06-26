import React, { useState } from "react"
import moment from "moment"
import { cancelBooking, getBookingByConfirmationCode } from "../utils/ApiFunctions"

const FindBooking = () => {
	const userRole = localStorage.getItem("userRole")
	const [confirmationCode, setConfirmationCode] = useState("")
	const [error, setError] = useState(null)
	const [successMessage, setSuccessMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [bookingInfo, setBookingInfo] = useState({
		id: "",
		confirmationCode: "",
		checkIn: "",
		checkOut: "",
		guestName: "",
		guestEmail: "",
		totalNumOfGuests: "",
		bookedRooms: []
	})

	const emptyBookingInfo = {
		id: "",
		confirmationCode: "",
		checkIn: "",
		checkOut: "",
		guestName: "",
		guestEmail: "",
		totalNumOfGuests: "",
		bookedRooms: []
	}
	const [isDeleted, setIsDeleted] = useState(false)

	const handleInputChange = (event) => {
		setConfirmationCode(event.target.value)
	}

	const handleFormSubmit = async (event) => {
		event.preventDefault()
		setIsLoading(true)

		try {
			const data = await getBookingByConfirmationCode(confirmationCode)
			setBookingInfo(data)
			setError(null)
		} catch (error) {
			setBookingInfo(emptyBookingInfo)
			if (error.response && error.response.status === 404) {
				setError(error.response.data.message)
			} else {
				setError(error.message)
			}
		}

		setTimeout(() => setIsLoading(false), 2000)
	}

	const handleBookingCancellation = async (bookingId) => {
		try {
			await cancelBooking(bookingInfo.id)
			setIsDeleted(true)
			setSuccessMessage("Booking has been cancelled successfully!")
			setBookingInfo(emptyBookingInfo)
			setConfirmationCode("")
			setError(null)
		} catch (error) {
			setError(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setIsDeleted(false)
		}, 2000)
	}

	return (
		<>
			<div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
				<h2 className="text-center mb-4">Find My Booking</h2>
				<form onSubmit={handleFormSubmit} className="col-md-6">
					<div className="input-group mb-3">
						<input
							className="form-control"
							type="text"
							id="confirmationCode"
							name="confirmationCode"
							value={confirmationCode}
							onChange={handleInputChange}
							placeholder="Enter the booking confirmation code"
						/>

						<button type="submit" className="btn btn-hotel input-group-text">
							Find booking
						</button>
					</div>
				</form>

				{isLoading ? (
					<div className="mt-4">
						<div className="spinner-border hotel-color" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
						<div className="mt-2">Finding your booking...</div>
					</div>
				) : error ? (
					<div className="alert alert-danger mt-4 col-md-6">Error: {error}</div>
				) : bookingInfo.confirmationCode ? (
					<div className="col-md-7 mt-4 mb-5 shadow p-4 rounded bg-white">
						<h3 className="hotel-color mb-4">Booking Information</h3>
						<div className="row">
							<div className="col-md-6">
								<p><strong>Confirmation Code:</strong> <span className="text-success">{bookingInfo.confirmationCode}</span></p>
								<p><strong>Full Name:</strong> {bookingInfo.guestName}</p>
								<p><strong>Email:</strong> {bookingInfo.guestEmail}</p>
								<p><strong>Total Guests:</strong> {bookingInfo.totalGuests}</p>
							</div>
							<div className="col-md-6">
								<p><strong>Check-in:</strong> {moment(bookingInfo.checkIn).format("MMM Do, YYYY")}</p>
								<p><strong>Check-out:</strong> {moment(bookingInfo.checkOut).format("MMM Do, YYYY")}</p>
								<p><strong>Total Amount:</strong> {bookingInfo.totalAmount?.toLocaleString()} VNĐ</p>
							</div>
						</div>

						<h5 className="mt-4 mb-3 border-bottom pb-2">Room Details</h5>
						{bookingInfo.bookedRooms && bookingInfo.bookedRooms.map((room) => (
							<div key={room.id} className="mb-3 p-3 border rounded bg-light">
								<div className="row align-items-center">
									<div className="col-md-8">
										<p className="mb-0"><strong>Room {room.roomNumber}</strong> - {room.roomType}</p>
										<p className="mb-0 text-muted small">
											Price at booking: {room.priceAtBooking?.toLocaleString()} VNĐ / night
										</p>
									</div>
									<div className="col-md-4 text-end">
										<p className="mb-0 small">{room.numAdults} Adults, {room.numChildren} Children</p>
									</div>
								</div>
							</div>
						))}

						{userRole === "ROLE_ADMIN" && !isDeleted && (
							<div className="text-center mt-4">
								<button
									onClick={() => handleBookingCancellation(bookingInfo.id)}
									className="btn btn-danger px-4">
									Cancel Booking
								</button>
							</div>
						)}
					</div>
				) : (
					<div className="mt-4 text-muted italic">No booking loaded yet...</div>
				)}

				{isDeleted && <div className="alert alert-success mt-3 fade show">{successMessage}</div>}
			</div>
		</>
	)
}

export default FindBooking
