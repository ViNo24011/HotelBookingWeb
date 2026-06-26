import React, { useState } from "react"
import { Form, Button, Row, Col, Container } from "react-bootstrap"
import moment from "moment"
import { getAvailableRooms } from "../utils/ApiFunctions"
import RoomSearchResults from "./RoomSearchResult"
import RoomTypeSelector from "./RoomTypeSelector"

const RoomSearch = () => {
	const [searchQuery, setSearchQuery] = useState({
		checkInDate: "",
		checkOutDate: "",
		roomTypeId: ""
	})

	const [errorMessage, setErrorMessage] = useState("")
	const [availableRooms, setAvailableRooms] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const handleSearch = (e) => {
		e.preventDefault()
		const checkInMoment = moment(searchQuery.checkInDate)
		const checkOutMoment = moment(searchQuery.checkOutDate)
		if (!checkInMoment.isValid() || !checkOutMoment.isValid()) {
			setErrorMessage("Please enter valid dates")
			return
		}
		if (!checkOutMoment.isSameOrAfter(checkInMoment)) {
			setErrorMessage("Check-out date must be after check-in date")
			return
		}
		setIsLoading(true)
		getAvailableRooms(searchQuery.checkInDate, searchQuery.checkOutDate, searchQuery.roomTypeId)
			.then((response) => {
				setAvailableRooms(response.data)
				setTimeout(() => setIsLoading(false), 2000)
			})
			.catch((error) => {
				console.log(error)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setSearchQuery({ ...searchQuery, [name]: value })
		const checkInDate = moment(searchQuery.checkInDate)
		const checkOutDate = moment(searchQuery.checkOutDate)
		if (checkInDate.isValid() && checkOutDate.isValid()) {
			setErrorMessage("")
		}
	}
	const handleClearSearch = () => {
		setSearchQuery({
			checkInDate: "",
			checkOutDate: "",
			roomTypeId: ""
		})
		setAvailableRooms([])
	}

	return (
		<>
		<Container className="p-0">
			<Form onSubmit={handleSearch}>
				<Row className="g-3 align-items-end justify-content-center">
					<Col xs={12} md={3}>
						<Form.Group controlId="checkInDate">
							<Form.Label className="small fw-bold text-muted">Check-in Date</Form.Label>
							<Form.Control
								type="date"
								name="checkInDate"
								value={searchQuery.checkInDate}
								onChange={handleInputChange}
								min={moment().format("YYYY-MM-DD")}
								className="border-0 bg-light"
							/>
						</Form.Group>
					</Col>
					<Col xs={12} md={3}>
						<Form.Group controlId="checkOutDate">
							<Form.Label className="small fw-bold text-muted">Check-out Date</Form.Label>
							<Form.Control
								type="date"
								name="checkOutDate"
								value={searchQuery.checkOutDate}
								onChange={handleInputChange}
								min={moment().format("YYYY-MM-DD")}
								className="border-0 bg-light"
							/>
						</Form.Group>
					</Col>
					<Col xs={12} md={3}>
						<Form.Group controlId="roomType">
							<Form.Label className="small fw-bold text-muted">Room Type</Form.Label>
							<RoomTypeSelector
								handleRoomInputChange={handleInputChange}
								newRoom={searchQuery}
							/>
						</Form.Group>
					</Col>
					<Col xs={12} md={2}>
						<Button className="btn-hotel w-100 py-2 shadow-sm" type="submit">
							Search
						</Button>
					</Col>
				</Row>
			</Form>

			{isLoading ? (
				<div className="text-center mt-4">
					<div className="spinner-border text-primary spinner-border-sm" role="status"></div>
					<span className="ms-2 small text-muted">Finding available rooms...</span>
				</div>
			) : (availableRooms && availableRooms.length > 0) ? (
				<div className="mt-5 pt-4 border-top">
					<RoomSearchResults results={availableRooms} onClearSearch={handleClearSearch} />
				</div>
			) : (
				searchQuery.checkInDate && searchQuery.checkOutDate && !availableRooms.length && (
					<p className="mt-4 text-center small text-muted italic">No rooms available for these dates.</p>
				)
			)}
			{errorMessage && <p className="alert alert-danger mt-3 small p-2 text-center">{errorMessage}</p>}
		</Container>
		</>
	)
}

export default RoomSearch
