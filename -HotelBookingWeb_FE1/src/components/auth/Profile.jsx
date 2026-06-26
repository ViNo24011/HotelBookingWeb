import React, { useEffect, useState } from "react"
import { deleteUser, getBookingsByUserId, getUser, addReview } from "../utils/ApiFunctions"
import { useNavigate, Link } from "react-router-dom"
import moment from "moment"
import { FaUserCircle, FaEnvelope, FaIdCard, FaUserTag, FaHistory, FaTrashAlt, FaKey, FaAward, FaStar } from "react-icons/fa"
import { Container, Row, Col, Card, Table, Button, Modal, Form } from "react-bootstrap"

const Profile = () => {
	const [user, setUser] = useState(null)
	const [bookings, setBookings] = useState([])
	const [message, setMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [isLoading, setIsLoading] = useState(true)
	const [showReviewModal, setShowReviewModal] = useState(false)
	const [reviewData, setReviewData] = useState({
		bookingId: null,
		roomTypeId: null,
		rating: 5,
		comment: ""
	})
	const navigate = useNavigate()

	const userEmail = localStorage.getItem("userEmail")
	const token = localStorage.getItem("token")

	useEffect(() => {
		const fetchUserData = async () => {
			setIsLoading(true)
			try {
				const userData = await getUser(userEmail, token)
				setUser(userData)
				const bookingData = await getBookingsByUserId(userEmail, token)
				setBookings(bookingData)
			} catch (error) {
				setErrorMessage(error.message)
			} finally {
				setIsLoading(false)
			}
		}

		if (userEmail && token) {
			fetchUserData()
		}
	}, [userEmail, token])

	const handleDeleteAccount = async () => {
		const confirmed = window.confirm(
			"Are you sure you want to delete your account? This action cannot be undone."
		)
		if (confirmed) {
			try {
				await deleteUser(userEmail)
				setMessage("Account deleted successfully")
				localStorage.removeItem("token")
				localStorage.removeItem("userId")
				localStorage.removeItem("userEmail")
				localStorage.removeItem("userRole")
				navigate("/")
				window.location.reload()
			} catch (error) {
				setErrorMessage(error.message)
			}
		}
	}

	const handleShowReview = (booking) => {
		if (booking.status !== "COMPLETED") {
			setErrorMessage("You are not eligible to review yet. The order must be completed (after check-out and payment)!")
			setTimeout(() => setErrorMessage(""), 4000)
			return
		}
		setReviewData({
			bookingId: booking.id,
			roomTypeId: booking.roomTypeId,
			rating: 5,
			comment: ""
		})
		setShowReviewModal(true)
	}

	const handleReviewSubmit = async (e) => {
		e.preventDefault()
		try {
			const result = await addReview(user.id, reviewData)
			setMessage(result)
			setShowReviewModal(false)
		} catch (error) {
			setErrorMessage(error.message)
		}
		setTimeout(() => {
			setMessage("")
			setErrorMessage("")
		}, 3000)
	}

	if (isLoading) {
		return (
			<Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
				<div className="spinner-border hotel-color" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</Container>
		)
	}

	return (
		<Container className="my-5 fade-in">
			{errorMessage && <p className="alert alert-danger shadow-sm">{errorMessage}</p>}
			{message && <p className="alert alert-success shadow-sm">{message}</p>}

			<Row className="g-4">
				{/* Sidebar: Profile Info */}
				<Col lg={4}>
					<Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
						<div className="bg-primary py-5 text-center position-relative">
							<div className="position-absolute w-100 h-100 top-0 start-0 opacity-25" style={{background: "linear-gradient(45deg, var(--primary), var(--accent))"}}></div>
							<img
								src="https://themindfulaimanifesto.org/wp-content/uploads/2020/09/male-placeholder-image.jpeg"
								alt="Profile"
								className="rounded-circle border border-4 border-white shadow-lg position-relative"
								style={{ width: "120px", height: "120px", objectFit: "cover", zIndex: "2" }}
							/>
						</div>
						<Card.Body className="pt-4 text-center">
							<h3 className="fw-bold mb-1">{user?.firstName} {user?.lastName}</h3>
							<p className="text-muted small mb-4">{user?.email}</p>
							
							<div className="text-start px-3">
								<div className="d-flex align-items-center mb-3">
									<div className="bg-light p-2 rounded-3 me-3"><FaEnvelope className="hotel-color" /></div>
									<div>
										<small className="text-muted d-block uppercase small fw-bold">Email Address</small>
										<span className="fw-semibold">{user?.email}</span>
									</div>
								</div>
								<div className="d-flex align-items-center mb-3">
									<div className="bg-light p-2 rounded-3 me-3"><FaAward className="text-warning" /></div>
									<div>
										<small className="text-muted d-block uppercase small fw-bold">Loyalty Points</small>
										<span className="fw-semibold text-warning">{user?.loyaltyPoints || 0} pts</span>
									</div>
								</div>
								<div className="d-flex align-items-center mb-4">
									<div className="bg-light p-2 rounded-3 me-3"><FaUserTag className="hotel-color" /></div>
									<div>
										<small className="text-muted d-block uppercase small fw-bold">Roles</small>
										<div className="d-flex gap-1 flex-wrap mt-1">
											{user?.roles?.map((role) => (
												<span key={role.id} className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
													{role.name.replace("ROLE_", "")}
												</span>
											))}
										</div>
									</div>
								</div>
							</div>

							<hr className="opacity-10 my-4" />
							
							<div className="d-grid gap-2 px-3 pb-3">
								<Link to="/change-password" title="Change Password" style={{textDecoration: "none"}}>
									<Button variant="outline-primary" className="w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2">
										<FaKey /> Change Password
									</Button>
								</Link>
								<Button variant="outline-danger" className="w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2" onClick={handleDeleteAccount}>
									<FaTrashAlt /> Delete Account
								</Button>
							</div>
						</Card.Body>
					</Card>
				</Col>

				{/* Main Content: Booking History */}
				<Col lg={8}>
					<Card className="border-0 shadow-sm rounded-4 h-100">
						<Card.Body className="p-4">
							<div className="d-flex align-items-center gap-3 mb-4 pt-2">
								<div className="bg-light p-3 rounded-4"><FaHistory className="display-6 hotel-color" /></div>
								<div>
									<h2 className="h3 fw-bold mb-0">Booking History</h2>
									<p className="text-muted small mb-0">Track and manage your hotel reservations</p>
								</div>
							</div>

							{bookings.length > 0 ? (
								<div className="table-responsive">
									<Table hover className="align-middle">
										<thead className="bg-light">
											<tr>
												<th className="py-3 px-4 border-0">Booking ID</th>
												<th className="py-3 border-0">Check-In</th>
												<th className="py-3 border-0">Check-Out</th>
												<th className="py-3 border-0">Code</th>
												<th className="py-3 border-0">Total</th>
												<th className="py-3 border-0">Status</th>
												<th className="py-3 border-0">Action</th>
											</tr>
										</thead>
										<tbody>
											{bookings.map((booking, index) => (
												<tr key={index}>
													<td className="px-4 fw-bold">{booking.id}</td>
													<td>{moment(booking.checkIn).format("MMM Do, YYYY")}</td>
													<td>{moment(booking.checkOut).format("MMM Do, YYYY")}</td>
													<td><code className="text-primary bg-light p-1 rounded small">{booking.confirmationCode}</code></td>
													<td className="hotel-color fw-bold">
														{booking.totalAmount ? booking.totalAmount.toLocaleString() : "0"} VNĐ
													</td>
													<td>
														<span className={`badge rounded-pill ${
															booking.status === "COMPLETED" ? "bg-success" : 
															booking.status === "CONFIRMED" ? "bg-primary" : "bg-warning"
														}`}>
															{booking.status}
														</span>
													</td>
													<td>
														{booking.status === "COMPLETED" ? (
															<Button 
																variant="warning"
																size="sm" 
																className="rounded-pill px-3"
																onClick={() => handleShowReview(booking)}
															>
																<FaStar className="me-1" /> Rate Now
															</Button>
														) : booking.status === "PENDING" ? (
															<Button 
																variant="primary"
																size="sm" 
																className="rounded-pill px-3"
																onClick={() => navigate("/payment/qr", { 
																	state: { 
																		bookingId: booking.confirmationCode, 
																		totalAmount: booking.totalAmount 
																	} 
																})}
															>
																Pay Now
															</Button>
														) : (
															<Button 
																variant="outline-secondary"
																size="sm" 
																className="rounded-pill px-3"
																disabled
															>
																No Action
															</Button>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								</div>
							) : (
								<div className="text-center py-5 mt-4">
									<div className="bg-light d-inline-block p-4 rounded-circle mb-3">
										<FaHistory className="display-4 text-muted opacity-50" />
									</div>
									<h4 className="text-muted">No bookings yet</h4>
									<p className="text-muted small px-5">When you book a room, your reservation details will appear here.</p>
									<Link to="/browse-all-rooms" className="btn btn-hotel mt-3 rounded-pill px-4">Browse Rooms</Link>
								</div>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Review Modal */}
			<Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Submit Your Review</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleReviewSubmit}>
						<Form.Group className="mb-3 text-center">
							<Form.Label className="d-block mb-3">Room Quality (1-5 stars)</Form.Label>
							<div className="d-flex justify-content-center gap-2">
								{[1, 2, 3, 4, 5].map((star) => (
									<FaStar
										key={star}
										size={30}
										className="cursor-pointer"
										color={star <= reviewData.rating ? "#ffc107" : "#e4e5e9"}
										onClick={() => setReviewData({ ...reviewData, rating: star })}
										style={{ cursor: "pointer" }}
									/>
								))}
							</div>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Your Comment</Form.Label>
							<Form.Control
								as="textarea"
								rows={4}
								placeholder="Please share your experience about this room..."
								value={reviewData.comment}
								onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
								required
							/>
						</Form.Group>
						<div className="d-flex justify-content-end gap-2">
							<Button variant="secondary" onClick={() => setShowReviewModal(false)}>
								Cancel
							</Button>
							<Button variant="hotel" type="submit">
								Submit Review
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</Container>
	)
}

export default Profile
