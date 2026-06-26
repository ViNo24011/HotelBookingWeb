import React, { useContext, useEffect, useState } from "react"
import { Card, Col } from "react-bootstrap"
import { Link } from "react-router-dom"

const RoomCard = ({ room }) => {
	const [isSelected, setIsSelected] = useState(false)

	useEffect(() => {
		try {
			const selectedRooms = JSON.parse(localStorage.getItem("selectedRooms") || "[]")
			setIsSelected(selectedRooms.some((selectedRoom) => selectedRoom?.id === room.id))
		} catch (e) {
			setIsSelected(false)
		}
	}, [room.id])

	const handleToggleSelect = () => {
		let selectedRooms = []
		try {
			selectedRooms = JSON.parse(localStorage.getItem("selectedRooms") || "[]")
		} catch (e) {
			selectedRooms = []
		}

		// Map to lightweight IDs if there are existing full room objects
		const cleanSelectedRooms = selectedRooms
			.map((r) => (typeof r === "object" && r !== null ? { id: r.id } : r))
			.filter(Boolean)

		let updatedRooms
		if (isSelected) {
			updatedRooms = cleanSelectedRooms.filter((selectedRoom) => selectedRoom.id !== room.id)
		} else {
			updatedRooms = [...cleanSelectedRooms, { id: room.id }]
		}

		try {
			localStorage.setItem("selectedRooms", JSON.stringify(updatedRooms))
		} catch (error) {
			console.error("Failed to save to localStorage", error)
			localStorage.removeItem("selectedRooms")
			try {
				localStorage.setItem("selectedRooms", JSON.stringify([{ id: room.id }]))
			} catch (e) {
				console.error("localStorage is completely unusable", e)
			}
		}
		setIsSelected(!isSelected)
		window.dispatchEvent(new Event("cartUpdated"))
	}

	return (
		<Col key={room.id} className="mb-4" xs={12}>
			<Card className="room-card">
				<Card.Body className="d-flex flex-wrap align-items-center p-0">
					<div className="flex-shrrink-0">
						<Link to={`/book-room/${room.id}`}>
							<Card.Img
								variant="top"
								src={room.photo ? `data:image/png;base64,${room.photo}` : "https://via.placeholder.com/300x200?text=No+Photo"}
								alt="Room Photo"
								style={{ width: "300px", height: "200px", objectFit: "cover" }}
							/>
						</Link>
					</div>
					<div className="flex-grow-1 p-4">
						<Card.Title className="hotel-color h4 mb-2">
							Room {room.roomNumber} - {room.roomType ? room.roomType.name : "N/A"}
						</Card.Title>
						<Card.Text className="text-muted mb-3">
							{room.roomType?.description || "Experience ultimate comfort and luxury in our most refined rooms."}
						</Card.Text>
						<div className="d-flex align-items-center gap-3">
							<span className="room-price">{room.price ? room.price.toLocaleString() : "0"} VNĐ</span>
							<span className="text-muted small">/ night</span>
						</div>
					</div>
					<div className="p-4 d-flex flex-column gap-2">
						<Link to={`/book-room/${room.id}`} className="btn btn-outline-secondary btn-sm rounded-pill px-4">
							Detail
						</Link>
						<button
							className={`btn btn-sm rounded-pill px-4 ${isSelected ? "btn-danger" : "btn-hotel"}`}
							onClick={handleToggleSelect}>
							{isSelected ? "Remove" : "Book Now"}
						</button>
					</div>
				</Card.Body>
			</Card>
		</Col>
	)
}

export default RoomCard
