import React from "react"
import { Container, Row, Col, Card } from "react-bootstrap"
import Header from "./Header"
import {
	FaClock,
	FaCocktail,
	FaParking,
	FaSnowflake,
	FaTshirt,
	FaUtensils,
	FaWifi
} from "react-icons/fa"

const HotelService = () => {
	return (
		<>
		<section className="py-5">
			<Container>
				<div className="text-center mb-5">
					<h2 className="display-5 hotel-color">Our Services</h2>
					<p className="text-muted">Experience world-class amenities designed for your comfort</p>
					<div className="d-flex justify-content-center align-items-center gap-3 mt-3">
						<FaClock className="hotel-color" /> <span>24-Hour Front Desk</span>
					</div>
				</div>

				<Row xs={1} md={2} lg={3} className="g-4">
					<Col>
						<Card className="h-100 border-0 shadow-sm hover-up">
							<Card.Body className="text-center p-4">
								<div className="mb-3">
									<FaWifi className="display-6 hotel-color" />
								</div>
								<Card.Title className="h5">Free High-Speed WiFi</Card.Title>
								<Card.Text className="text-muted">Stay connected with our seamless and fast internet access throughout the hotel.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card className="h-100 border-0 shadow-sm hover-up">
							<Card.Body className="text-center p-4">
								<div className="mb-3">
									<FaUtensils className="display-6 hotel-color" />
								</div>
								<Card.Title className="h5">Gourmet Breakfast</Card.Title>
								<Card.Text className="text-muted">Start your morning with a fresh, chef-prepared international breakfast buffet.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card className="h-100 border-0 shadow-sm hover-up">
							<Card.Body className="text-center p-4">
								<div className="mb-3">
									<FaTshirt className="display-6 hotel-color" />
								</div>
								<Card.Title className="h5">Premium Laundry</Card.Title>
								<Card.Text className="text-muted">Keep your wardrobe perfect with our professional same-day laundry services.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card className="h-100 border-0 shadow-sm hover-up">
							<Card.Body className="text-center p-4">
								<div className="mb-3">
									<FaCocktail className="display-6 hotel-color" />
								</div>
								<Card.Title className="h5">Mini-Bar</Card.Title>
								<Card.Text className="text-muted">A curated selection of premium beverages and gourmet snacks at your fingertips.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card className="h-100 border-0 shadow-sm hover-up">
							<Card.Body className="text-center p-4">
								<div className="mb-3">
									<FaParking className="display-6 hotel-color" />
								</div>
								<Card.Title className="h5">Secure Parking</Card.Title>
								<Card.Text className="text-muted">Safe and convenient on-site parking available for all our guests.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card className="h-100 border-0 shadow-sm hover-up">
							<Card.Body className="text-center p-4">
								<div className="mb-3">
									<FaSnowflake className="display-6 hotel-color" />
								</div>
								<Card.Title className="h5">Climate Control</Card.Title>
								<Card.Text className="text-muted">Personalized air conditioning in every room for your perfect environment.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</section>
			<hr />
		</>
	)
}

export default HotelService
