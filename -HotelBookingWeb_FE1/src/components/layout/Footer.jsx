import React from "react"
import { Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

const Footer = () => {
	let today = new Date()

	return (
		<footer className="footer mt-5">
			<Container>
				<Row className="mb-4">
					<Col xs={12} md={4} className="mb-4 mb-md-0">
						<h5 className="text-white mb-3 fw-bold">lakeSide Hotel</h5>
						<p className="small lh-lg" style={{ color: "#cbd5e1" }}>
							Discover unparalleled luxury and relaxation at lakeSide Hotel. We are committed to providing you with the best hospitality experience in the heart of the city.
						</p>
					</Col>
					<Col xs={6} md={4} className="mb-4 mb-md-0 ps-md-5 text-center text-md-start">
						<h5 className="text-white mb-3 fw-bold">Quick Links</h5>
						<ul className="list-unstyled small">
							<li className="mb-2"><Link to={"/"} className="text-decoration-none text-light opacity-75 transition hover-opacity-100">Home</Link></li>
							<li className="mb-2"><Link to={"/browse-all-rooms"} className="text-decoration-none text-light opacity-75 transition hover-opacity-100">Browse Rooms</Link></li>
							<li className="mb-2"><Link to={"/about-us"} className="text-decoration-none text-light opacity-75 transition hover-opacity-100">About Us</Link></li>
							<li className="mb-2"><Link to={"/hotel-rules"} className="text-decoration-none text-light opacity-75 transition hover-opacity-100">Hotel Rules</Link></li>
							<li className="mb-2"><Link to={"/find-booking"} className="text-decoration-none text-light opacity-75 transition hover-opacity-100">Find My Booking</Link></li>
						</ul>
					</Col>
					
					<Col xs={6} md={4} className="ps-md-5 text-center text-md-start">
						<h5 className="text-white mb-3 fw-bold">Contact Us</h5>
						<div className="small mb-2" style={{ color: "#cbd5e1" }}>
							<span className="d-block mb-1">123 Lake Side, Hanoi, Vietnam</span>
							<span className="d-block mb-1">Phone: +84 123 456 789</span>
							<span className="d-block">Email: contact@lakeside.com</span>
						</div>
					</Col>
				</Row>
				
				<hr className="border-secondary opacity-25" />
				
				<Row className="pt-2">
					<Col className="text-center">
						<p className="mb-0 small opacity-75" style={{ color: "#cbd5e1" }}> 
							&copy; {today.getFullYear()} lakeSide Hotel. All Rights Reserved. Crafted with Excellence.
						</p>
					</Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Footer
