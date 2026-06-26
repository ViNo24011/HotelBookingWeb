import React, { useEffect, useState } from "react"
import { getAllRooms } from "../utils/ApiFunctions"
import { Link } from "react-router-dom"
import { Card, Carousel, Col, Container, Row } from "react-bootstrap"

const RoomCarousel = ({ rooms: propRooms, limit = 8, isLoading = false }) => {
	const [rooms, setRooms] = useState([])
	const [errorMessage, setErrorMessage] = useState("")
	const [localIsLoading, setLocalIsLoading] = useState(false)

	useEffect(() => {
		if (propRooms) {
			setRooms(propRooms.slice(0, limit))
			return
		}
		setLocalIsLoading(true)
		getAllRooms()
			.then((data) => {
				setRooms(data.slice(0, limit))
				setLocalIsLoading(false)
			})
			.catch((error) => {
				setErrorMessage(error.message)
				setLocalIsLoading(false)
			})
	}, [propRooms, limit])

	if (isLoading || localIsLoading) {
		return (
			<div className="d-flex justify-content-center align-items-center my-5">
				<div className="spinner-border text-primary" role="status" style={{ color: "var(--hotel-color)" }}>
					<span className="visually-hidden">Loading rooms...</span>
				</div>
			</div>
		)
	}
	if (errorMessage) {
		return <div className=" text-danger mb-5 mt-5">Error : {errorMessage}</div>
	}

	if (!Array.isArray(rooms) || rooms.length === 0) {
		return null
	}

	return (
		<section className="mb-5 mt-5">
			<Container>
				<Carousel indicators={false} interval={5000}>
					{[...Array(Math.ceil(rooms.length / 4))].map((_, index) => (
						<Carousel.Item key={index}>
							<Row>
								{rooms.slice(index * 4, index * 4 + 4).map((room) => (
									<Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
										<Card className="room-card h-100 border-0 shadow-sm">
											<Link to={`/book-room/${room.id}`}>
												<Card.Img
													variant="top"
													src={room.photo ? `data:image/png;base64,${room.photo}` : "https://via.placeholder.com/300x200?text=No+Photo"}
													alt="Room Photo"
													className="w-100"
													style={{ height: "200px", objectFit: "cover" }}
												/>
											</Link>
											<Card.Body className="d-flex flex-column">
												<Card.Title className="hotel-color h6">{room.roomType ? room.roomType.name : "N/A"}</Card.Title>
												<Card.Title className="room-price small mb-3">
													{room.roomType ? room.roomType.basePrice.toLocaleString() : "0"} VNĐ / night
												</Card.Title>
												<div className="mt-auto">
													<Link to={`/book-room/${room.id}`} className="btn btn-hotel btn-sm w-100 rounded-pill">
														View Details
													</Link>
												</div>
											</Card.Body>
										</Card>
									</Col>
								))}
							</Row>
						</Carousel.Item>
					))}
				</Carousel>
			</Container>
		</section>
	)
}

export default RoomCarousel
