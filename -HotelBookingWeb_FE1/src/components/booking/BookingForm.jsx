import React, { useEffect } from "react"
import moment from "moment"
import { useState } from "react"
import { Form, FormControl, Button, Badge } from "react-bootstrap"
import BookingSummary from "./BookingSummary"
import { bookRoom, getActiveServices, getUser } from "../utils/ApiFunctions"
import { useNavigate, useLocation } from "react-router-dom"

const BookingForm = ({ selectedRooms = [] }) => {
	const [validated, setValidated] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

	const currentUserEmail = localStorage.getItem("userEmail")
	const token = localStorage.getItem("token")

	const [userProfile, setUserProfile] = useState(null)
	const [profileError, setProfileError] = useState(null)
	const [usePoints, setUsePoints] = useState(false)

	const navigate = useNavigate()
	const location = useLocation()
	const { bookingData } = location.state || {}

	const [booking, setBooking] = useState(bookingData ? {
		guestFullName: bookingData.guestName,
		guestEmail: bookingData.guestEmail || currentUserEmail,
		checkInDate: bookingData.checkIn,
		checkOutDate: bookingData.checkOut,
		numOfAdults: bookingData.selectedRooms?.[0]?.numAdults || "",
		numOfChildren: bookingData.selectedRooms?.[0]?.numChildren || ""
	} : {
		guestFullName: "",
		guestEmail: currentUserEmail,
		checkInDate: "",
		checkOutDate: "",
		numOfAdults: "",
		numOfChildren: ""
	})

	const [availableServices, setAvailableServices] = useState([])
	const [selectedServices, setSelectedServices] = useState({}) // { serviceId: quantity }

	useEffect(() => {
		fetchServices()
		if (currentUserEmail && token) {
			fetchUserProfile()
		}
	}, [currentUserEmail, token])

	const fetchUserProfile = async () => {
		try {
			setProfileError(null)
			const data = await getUser(currentUserEmail, token)
			setUserProfile(data)
		} catch (error) {
			console.error("Error fetching user profile:", error)
			setProfileError("Unable to load points info. Please try again.")
		}
	}

	const fetchServices = async () => {
		try {
			const services = await getActiveServices()
			setAvailableServices(services)
		} catch (error) {
			console.error("Error fetching services:", error)
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setBooking({ ...booking, [name]: value })
		setErrorMessage("")
		setIsSubmitted(false)
	}

	const calculatePayment = () => {
		const checkInDate = moment(booking.checkInDate)
		const checkOutDate = moment(booking.checkOutDate)
		const diffInDays = checkOutDate.diff(checkInDate, "days")
		const totalRoomPricePerNight = selectedRooms.reduce((acc, room) => acc + (room.price || 0), 0)
		
		let totalServicePrice = 0
		Object.entries(selectedServices).forEach(([serviceId, quantity]) => {
			const service = availableServices.find(s => s.id === parseInt(serviceId))
			if (service && quantity > 0) {
				totalServicePrice += service.price * quantity
			}
		})

		let total = diffInDays > 0 ? (diffInDays * totalRoomPricePerNight) + totalServicePrice : 0
		
		if (usePoints && userProfile) {
			const pointsValue = userProfile.loyaltyPoints // 1 điểm = 1 VNĐ
			total = Math.max(0, total - pointsValue)
		}

		return total
	}

	const handleServiceChange = (serviceId, quantity) => {
		setSelectedServices(prev => ({
			...prev,
			[serviceId]: quantity
		}))
		setIsSubmitted(false)
	}

	const isGuestCountValid = () => {
		const adultCount = parseInt(booking.numOfAdults)
		const childrenCount = parseInt(booking.numOfChildren)
		const totalCount = (isNaN(adultCount) ? 0 : adultCount) + (isNaN(childrenCount) ? 0 : childrenCount)
		
		if (isNaN(adultCount) || adultCount < 1) {
			setErrorMessage("At least 1 adult is required.")
			return false
		}
		if (totalCount < 1) {
			setErrorMessage("At least 1 guest is required.")
			return false
		}
		return true
	}

	const isEmailValid = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!booking.guestEmail || !emailRegex.test(booking.guestEmail)) {
			setErrorMessage("Invalid email. Please check your account information.")
			return false
		}
		return true
	}

	const isCheckOutDateValid = () => {
		if (!moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))) {
			setErrorMessage("Check-out date must be after check-in date")
			return false
		} else {
			setErrorMessage("")
			return true
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const form = e.currentTarget
		setErrorMessage("") // Clear previous errors
		
		const isValidHTML = form.checkValidity()
		const isValidEmail = isEmailValid()
		const isValidGuest = isGuestCountValid()
		const isValidDate = isCheckOutDateValid()

		if (!isValidHTML || !isValidEmail || !isValidGuest || !isValidDate) {
			e.stopPropagation()
			setIsSubmitted(false)
		} else {
			setIsSubmitted(true)
		}
		setValidated(true)
	}

	const handleFormSubmit = async () => {
		console.log("DEBUG: handleFormSubmit called manually")
		try {
			if (selectedRooms.length === 0) {
				setErrorMessage("No rooms selected.")
				return
			}
			// ... logic đặt phòng ...
			const bookingRequest = {
				userId: localStorage.getItem("userId"),
				checkIn: booking.checkInDate,
				checkOut: booking.checkOutDate,
				guestName: booking.guestFullName,
				selectedRooms: selectedRooms.map(room => ({
					roomId: room.id,
					numAdults: parseInt(booking.numOfAdults),
					numChildren: parseInt(booking.numOfChildren)
				})),
				selectedServices: Object.entries(selectedServices)
					.filter(([_, quantity]) => quantity > 0)
					.map(([serviceId, quantity]) => ({
						serviceId: parseInt(serviceId),
						quantity: parseInt(quantity)
					})),
				usePoints: usePoints
			}
			
			console.log("DEBUG: Sending booking request:", bookingRequest)
			const result = await bookRoom(bookingRequest)
		console.log("DEBUG: Booking successful, result:", result)
		
		// result bản chất đang là cái mã 10 số (String)
		const confirmedCode = result.confirmationCode; 
		// Bạn cần tính lại totalAmount bên này (hoặc Backend phải trả về kèm theo)
		const finalTotalAmount = calculatePayment(); 
		
		if (finalTotalAmount === 0) {
			localStorage.removeItem("selectedRooms")
			navigate("/booking-success", { 
				state: { 
					message: "Order successful! You have paid entirely with loyalty points.",
					confirmationCode: confirmedCode 
				} 
			})
		} else {
			navigate("/payment/qr", { 
				state: { 
					bookingId: confirmedCode, // Truyền đúng cái chuỗi 10 số vào
					totalAmount: finalTotalAmount, // Tự dùng biến tổng tiền tính ở Frontend
					originalBooking: bookingRequest,
					returnUrl: window.location.pathname
				} 
			})
		}
		} catch (error) {
			console.error("Booking error details:", error)
			const errorMessage = error.response?.data?.message || error.message || "Unknown system error."
			// Instead of redirecting, show error message here for user to fix
			alert("BOOKING ERROR: " + errorMessage)
			setErrorMessage(errorMessage)
		}
	}

	return (
		<>
			<div className="container mb-5">
				<div className="row">
					<div className="col-md-6">
						<div className="card card-body mt-5 shadow">
							<h4 className="card-title text-center mb-4">Reserve Selected Rooms</h4>

							<Form noValidate validated={validated} onSubmit={handleSubmit}>
								<Form.Group className="mb-3">
									<Form.Label htmlFor="guestFullName" className="hotel-color">
										Fullname
									</Form.Label>
									<FormControl
										required
										type="text"
										id="guestFullName"
										name="guestFullName"
										value={booking.guestFullName}
										placeholder="Enter your fullname"
										onChange={handleInputChange}
									/>
									<Form.Control.Feedback type="invalid">
										Please enter your fullname.
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Label htmlFor="guestEmail" className="hotel-color">
										Email
									</Form.Label>
									<FormControl
										required
										type="email"
										id="guestEmail"
										name="guestEmail"
										value={booking.guestEmail}
										placeholder="Enter your email"
										onChange={handleInputChange}
										disabled
									/>
									<Form.Control.Feedback type="invalid">
										Please enter a valid email address.
									</Form.Control.Feedback>
								</Form.Group>

								<fieldset className="border p-3 mb-3 rounded">
									<legend className="w-auto px-2 fs-6 fw-bold">Lodging Period</legend>
									<div className="row">
										<div className="col-6">
											<Form.Label htmlFor="checkInDate" className="hotel-color">
												Check-in date
											</Form.Label>
											<FormControl
												required
												type="date"
												id="checkInDate"
												name="checkInDate"
												value={booking.checkInDate}
												min={moment().format("YYYY-MM-DD")}
												onChange={handleInputChange}
											/>
										</div>

										<div className="col-6">
											<Form.Label htmlFor="checkOutDate" className="hotel-color">
												Check-out date
											</Form.Label>
											<FormControl
												required
												type="date"
												id="checkOutDate"
												name="checkOutDate"
												value={booking.checkOutDate}
												min={moment().format("YYYY-MM-DD")}
												onChange={handleInputChange}
											/>
										</div>
										{errorMessage && <p className="error-message text-danger mt-2">{errorMessage}</p>}
									</div>
								</fieldset>

								<fieldset className="border p-3 mb-4 rounded">
									<legend className="w-auto px-2 fs-6 fw-bold">Number of Guest</legend>
									<div className="row">
										<div className="col-6">
											<Form.Label htmlFor="numOfAdults" className="hotel-color">
												Adults
											</Form.Label>
											<FormControl
												required
												type="number"
												id="numOfAdults"
												name="numOfAdults"
												value={booking.numOfAdults}
												min={1}
												placeholder="0"
												onChange={handleInputChange}
											/>
										</div>
										<div className="col-6">
											<Form.Label htmlFor="numOfChildren" className="hotel-color">
												Children
											</Form.Label>
											<FormControl
												required
												type="number"
												id="numOfChildren"
												name="numOfChildren"
												value={booking.numOfChildren}
												placeholder="0"
												min={0}
												onChange={handleInputChange}
											/>
										</div>
									</div>
								</fieldset>

								{/* Loyalty Points Section */}
								{!token ? (
									<div className="mb-4 p-3 border rounded bg-light small">
										Login to earn and use reward points for this order.
									</div>
								) : profileError ? (
									<div className="mb-4 p-3 border rounded border-danger bg-light shadow-sm d-flex justify-content-between align-items-center">
										<span className="small text-danger">{profileError}</span>
										<Button variant="outline-danger" size="sm" onClick={fetchUserProfile}>Try again</Button>
									</div>
								) : !userProfile ? (
									<div className="mb-4 p-3 border rounded bg-light shadow-sm d-flex align-items-center">
										<div className="spinner-border spinner-border-sm text-warning me-2" role="status"></div>
										<span className="small text-muted">Loading loyalty points...</span>
									</div>
								) : (
									<div className={`mb-4 p-3 border rounded shadow-sm ${(userProfile?.loyaltyPoints || 0) > 0 ? "border-warning bg-light" : "bg-white opacity-75"}`}>
										<Form.Check 
											type="switch"
											id="usePoints"
											disabled={!userProfile || userProfile.loyaltyPoints === 0}
											label={
												<div className="ms-2">
													<div className="fw-bold">Use loyalty points</div>
													<div className="text-muted small">
														You have <Badge bg={(userProfile?.loyaltyPoints || 0) > 0 ? "warning" : "secondary"} text="dark">{(userProfile?.loyaltyPoints || 0).toLocaleString()}</Badge> points 
														(Equivalent to <span className="text-success fw-bold">{(userProfile?.loyaltyPoints || 0).toLocaleString()} VNĐ</span>)
													</div>
												</div>
											}
											checked={usePoints}
											onChange={(e) => {
												setUsePoints(e.target.checked)
												setIsSubmitted(false)
											}}
										/>
										{(userProfile?.loyaltyPoints || 0) === 0 && (
											<small className="text-muted ms-5 d-block">
												You don't have loyalty points yet. Complete orders to get 5% cashback!
											</small>
										)}
									</div>
								)}


								{availableServices.length > 0 && (
									<fieldset className="border p-3 mb-4 rounded">
										<legend className="w-auto px-2 fs-6 fw-bold hotel-color">Extra Services</legend>
										<div className="row">
											{availableServices.map((service) => (
												<div key={service.id} className="col-12 mb-2 d-flex justify-content-between align-items-center">
													<div>
														<Form.Check 
															type="checkbox"
															id={`service-${service.id}`}
															label={`${service.name} (${service.price.toLocaleString()} VNĐ${service.unit ? ' ' + service.unit : ''})`}
															checked={selectedServices[service.id] > 0}
															onChange={(e) => handleServiceChange(service.id, e.target.checked ? 1 : 0)}
														/>
														{service.description && <small className="text-muted d-block ms-4">{service.description}</small>}
													</div>
													{selectedServices[service.id] > 0 && (
														<div className="d-flex align-items-center">
															<span className="me-2 small">Qty:</span>
															<Form.Control 
																type="number"
																size="sm"
																style={{ width: "60px" }}
																min="1"
																value={selectedServices[service.id]}
																onChange={(e) => {
																	const val = parseInt(e.target.value)
																	handleServiceChange(service.id, isNaN(val) ? 1 : val)
																}}
															/>
														</div>
													)}
												</div>
											))}
										</div>
									</fieldset>
								)}



								<div className="d-grid">
									<button type="submit" className="btn btn-hotel">
										Review and Confirm
									</button>
								</div>
							</Form>
						</div>
					</div>

					<div className="col-md-6">
						{isSubmitted && (
							<BookingSummary
								booking={booking}
								payment={calculatePayment()}
								onConfirm={handleFormSubmit}
								isFormValid={validated}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
export default BookingForm
