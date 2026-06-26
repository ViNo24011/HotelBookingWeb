import React from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col, Card } from "react-bootstrap"
import { FaBed, FaCalendarAlt, FaUserShield, FaChartLine, FaConciergeBell } from "react-icons/fa"

const Admin = () => {
	return (
		<Container className="my-5 py-5 text-center">
			<div className="mb-5 fade-in">
				<FaUserShield className="display-4 hotel-color mb-3" />
				<h1 className="display-5 fw-bold">Admin Dashboard</h1>
				<p className="text-muted">Manage your hotel resources efficiently and professionally.</p>
				<hr className="mx-auto" style={{ width: "100px", height: "3px", backgroundColor: "var(--accent)" }} />
			</div>

			<Row className="g-4 justify-content-center mb-4">
				<Col xs={12} md={10} lg={12}>
					<Link to={"/admin-dashboard"} className="text-decoration-none d-block">
						<Card className="border-0 shadow-sm room-card p-3 transition" style={{ backgroundColor: "#f8f9fa", borderLeft: "5px solid var(--hotel-color) !important" }}>
							<Card.Body className="d-flex align-items-center justify-content-between">
								<div className="d-flex align-items-center">
									<div className="bg-white p-3 rounded-circle shadow-sm me-4">
										<FaChartLine className="h3 mb-0 hotel-color" />
									</div>
									<div className="text-start">
										<h3 className="h4 mb-1">General Statistics</h3>
										<p className="text-muted mb-0 small">View revenue, booking volume, and hotel performance analytics at a glance.</p>
									</div>
								</div>
								<span className="btn btn-hotel rounded-pill px-4">View Dashboard</span>
							</Card.Body>
						</Card>
					</Link>
				</Col>
			</Row>

			<Row className="g-4 justify-content-center">
				<Col xs={12} md={5} lg={4}>
					<Link to={"/existing-rooms"} className="text-decoration-none h-100 d-block">
						<Card className="h-100 border-0 shadow-sm room-card p-4 transition">
							<Card.Body className="d-flex flex-column align-items-center">
								<div className="bg-light p-4 rounded-circle mb-4">
									<FaBed className="display-6 hotel-color" />
								</div>
								<h3 className="h4 mb-3">Manage Rooms</h3>
								<p className="text-muted small">Add, edit, or remove hotel rooms and update their categories.</p>
								<div className="mt-auto">
									<span className="btn btn-outline-primary rounded-pill px-4 btn-sm">Enter Dashboard</span>
								</div>
							</Card.Body>
						</Card>
					</Link>
				</Col>

				<Col xs={12} md={5} lg={4}>
					<Link to={"/existing-bookings"} className="text-decoration-none h-100 d-block">
						<Card className="h-100 border-0 shadow-sm room-card p-4 transition">
							<Card.Body className="d-flex flex-column align-items-center">
								<div className="bg-light p-4 rounded-circle mb-4">
									<FaCalendarAlt className="display-6 hotel-color" />
								</div>
								<h3 className="h4 mb-3">Manage Bookings</h3>
								<p className="text-muted small">View all reservations, confirm payments, and manage cancellations.</p>
								<div className="mt-auto">
									<span className="btn btn-outline-primary rounded-pill px-4 btn-sm">Enter Dashboard</span>
								</div>
							</Card.Body>
						</Card>
					</Link>
				</Col>

				<Col xs={12} md={5} lg={4}>
					<Link to={"/existing-room-types"} className="text-decoration-none h-100 d-block">
						<Card className="h-100 border-0 shadow-sm room-card p-4 transition">
							<Card.Body className="d-flex flex-column align-items-center">
								<div className="bg-light p-4 rounded-circle mb-4">
									<FaUserShield className="display-6 hotel-color" />
								</div>
								<h3 className="h4 mb-3">Manage Room Types</h3>
								<p className="text-muted small">Configure prices and photos for each category (VIP, Deluxe, etc.).</p>
								<div className="mt-auto">
									<span className="btn btn-outline-primary rounded-pill px-4 btn-sm">Manage Categories</span>
								</div>
							</Card.Body>
						</Card>
					</Link>
				</Col>

				<Col xs={12} md={5} lg={4}>
					<Link to={"/manage-services"} className="text-decoration-none h-100 d-block">
						<Card className="h-100 border-0 shadow-sm room-card p-4 transition">
							<Card.Body className="d-flex flex-column align-items-center">
								<div className="bg-light p-4 rounded-circle mb-4">
									<FaConciergeBell className="display-6 hotel-color" />
								</div>
								<h3 className="h4 mb-3">Manage Services</h3>
								<p className="text-muted small">Add, edit, or remove extra services (Spa, Breakfast, etc.).</p>
								<div className="mt-auto">
									<span className="btn btn-outline-primary rounded-pill px-4 btn-sm">Manage Services</span>
								</div>
							</Card.Body>
						</Card>
					</Link>
				</Col>
			</Row>
		</Container>
	)
}

export default Admin
