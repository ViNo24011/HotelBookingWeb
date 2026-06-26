import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getBookingByConfirmationCode, deleteBookingByConfirmationCode } from "../utils/ApiFunctions"
import { Container, Card, Row, Col, Spinner, Button, Badge } from "react-bootstrap"
import { FaCheckCircle, FaQrcode, FaInfoCircle, FaArrowLeft, FaUniversity, FaCopy } from "react-icons/fa"

const QRPayment = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { bookingId, totalAmount, originalBooking, returnUrl } = location.state || {}
	
	const [status, setStatus] = useState("PENDING")
	const [isLoading, setIsLoading] = useState(false)
	const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
	const [copySuccess, setCopySuccess] = useState("")

	useEffect(() => {
		if (!bookingId) {
			navigate("/")
			return
		}

		// Polling status every 5 seconds
		const interval = setInterval(async () => {
			try {
				const response = await getBookingByConfirmationCode(bookingId)
				if (response.status === "COMPLETED" || response.status === "CONFIRMED") {
					setStatus("COMPLETED")
					localStorage.removeItem("selectedRooms")
					clearInterval(interval)
				}
			} catch (error) {
				console.error("Error polling payment status:", error)
			}
		}, 5000)

		// Countdown timer
		const countdown = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(countdown)
					clearInterval(interval)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => {
			clearInterval(interval)
			clearInterval(countdown)
		}
	}, [bookingId, navigate])

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, "0")}`
	}

	const copyToClipboard = (text, type) => {
		navigator.clipboard.writeText(text)
		setCopySuccess(type)
		setTimeout(() => setCopySuccess(""), 2000)
	}

	if (status === "COMPLETED") {
		return (
			<Container className="py-5 text-center">
				<Card className="border-0 shadow-lg p-5 mx-auto" style={{ maxWidth: "600px" }}>
					<div className="mb-4">
						<FaCheckCircle className="text-success" size={80} />
					</div>
					<h2 className="fw-bold mb-3">Payment Successful!</h2>
					<p className="text-muted mb-4">
						Your booking has been confirmed. We have sent the details to your email.
					</p>
					<div className="bg-light p-3 rounded mb-4 text-start">
						<div className="d-flex justify-content-between mb-2">
							<span>Booking Code:</span>
							<span className="fw-bold">{bookingId}</span>
						</div>
						<div className="d-flex justify-content-between">
							<span>Total:</span>
							<span className="fw-bold text-primary">{totalAmount?.toLocaleString()} VNĐ</span>
						</div>
					</div>
					<Button variant="primary" onClick={() => navigate("/profile")} className="py-2 px-4 rounded-pill">
						View Booking History
					</Button>
				</Card>
			</Container>
		)
	}

	return (
		<Container className="py-5">
			<Row className="justify-content-center">
				<Col md={11} lg={10}>
					<Card className="border-0 shadow-lg overflow-hidden rounded-4">
						<Row className="g-0">
							{/* QR Code Side */}
							<Col md={5} className="bg-white p-4 p-lg-5 d-flex flex-column align-items-center justify-content-center border-end">
								<h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
									<FaQrcode className="text-primary" /> Scan QR Code
								</h5>
								
								<div className="position-relative p-2 border rounded-4 bg-white shadow-sm mb-4" style={{ minHeight: "220px", minWidth: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
									<img 
										src={`https://qr.sepay.vn/img?acc=VQRQAIIXU6496&bank=MBBank&amount=${totalAmount}&des=${encodeURIComponent(bookingId)}`} 
										alt="Payment QR Code"
										className="img-fluid"
										style={{ width: "220px", height: "220px" }}
									onError={(e) => {
										e.target.onerror = null;
										e.target.style.display = "none";
										const parent = e.target.parentElement;
										parent.innerHTML = '<div class="text-center p-3"><div class="text-muted small mb-2">Unable to load QR</div><div class="text-danger fw-bold small">Please check your connection</div></div>';
									}}
									/>
									{timeLeft === 0 && (
										<div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center rounded-4">
											<span className="fw-bold text-danger">Code expired</span>
										</div>
									)}
								</div>

								<div className="text-center mb-0">
									<div className="text-muted small mb-1">Time remaining</div>
									<div className={`fs-4 fw-bold ${timeLeft < 60 ? "text-danger" : "text-dark"}`}>
										{formatTime(timeLeft)}
									</div>
								</div>
							</Col>

							{/* Manual Transfer Side */}
							<Col md={7} className="bg-light p-4 p-lg-5">
								<div className="d-flex justify-content-between align-items-center mb-4">
									<h4 className="fw-bold mb-0">Payment Information</h4>
									<Badge bg="info" className="p-2">Awaiting Payment</Badge>
								</div>
								
								<div className="alert alert-warning border-0 small mb-4 py-2">
									<FaInfoCircle className="me-2" />
									If you don't see the QR code, please transfer using the information below.
								</div>

								<div className="bg-white p-4 rounded-4 shadow-sm mb-4">
									<div className="mb-3">
										<label className="text-muted small d-block mb-1">Bank</label>
										<div className="d-flex align-items-center gap-2 fw-bold">
											<FaUniversity className="text-primary" /> MB Bank (Military Bank)
										</div>
									</div>

									<Row className="mb-3">
										<Col xs={7}>
											<label className="text-muted small d-block mb-1">Account Number</label>
											<div className="fw-bold fs-5">0963148185</div>
										</Col>
										<Col xs={5} className="text-end">
											<Button variant="outline-primary" size="sm" onClick={() => copyToClipboard("0963148185", "stk")}>
												<FaCopy /> {copySuccess === "stk" ? "Copied" : "Copy"}
											</Button>
										</Col>
									</Row>

									<Row className="mb-3">
										<Col xs={7}>
											<label className="text-muted small d-block mb-1">Transfer Amount</label>
											<div className="fw-bold fs-5 text-primary">{totalAmount?.toLocaleString()} VNĐ</div>
										</Col>
										<Col xs={5} className="text-end">
											<Button variant="outline-primary" size="sm" onClick={() => copyToClipboard(totalAmount?.toString(), "money")}>
												<FaCopy /> {copySuccess === "money" ? "Copied" : "Copy"}
											</Button>
										</Col>
									</Row>

									<Row>
										<Col xs={7}>
											<label className="text-muted small d-block mb-1">Transfer Message</label>
											<div className="fw-bold fs-6 text-uppercase">{bookingId}</div>
										</Col>
										<Col xs={5} className="text-end">
											<Button variant="outline-primary" size="sm" onClick={() => copyToClipboard(bookingId, "code")}>
												<FaCopy /> {copySuccess === "code" ? "Copied" : "Copy"}
											</Button>
										</Col>
									</Row>
								</div>

								<div className="d-flex flex-column gap-3">
									<div className="d-flex align-items-center gap-2 text-muted small">
										<div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
										Waiting for payment confirmation...
									</div>

									<hr className="my-2 opacity-10" />

									<Button 
										variant="link" 
										className="text-muted text-decoration-none p-0 d-flex align-items-center gap-2 small" 
										onClick={async () => {
										try {
											if (bookingId) {
												await deleteBookingByConfirmationCode(bookingId).catch(e => console.warn("Booking not found on delete"));
											}
											// Ép tải lại trang để xóa sạch các trạng thái lỗi cũ
											const target = returnUrl || "/browse-all-rooms"
											window.location.href = target
										} catch (error) {
											console.error("Error navigating back:", error)
											window.location.href = "/"
										}
									}}
									>
										<FaArrowLeft /> Cancel and edit booking information
									</Button>
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default QRPayment
