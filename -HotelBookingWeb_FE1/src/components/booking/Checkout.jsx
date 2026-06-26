import React, { useEffect, useState } from "react"
import BookingForm from "../booking/BookingForm"
import {
	FaUtensils,
	FaWifi,
	FaTv,
	FaWineGlassAlt,
	FaParking,
	FaCar,
	FaTshirt,
	FaCheckCircle
} from "react-icons/fa"

import { useParams, useLocation } from "react-router-dom"
import { getRoomById } from "../utils/ApiFunctions"
import RoomCarousel from "../common/RoomCarousel"
import ReviewSection from "../room/ReviewSection"

const Checkout = () => {
	const location = useLocation()
	const [error, setError] = useState(null)
	const [storageError, setStorageError] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [selectedRooms, setSelectedRooms] = useState([])

	const { roomId } = useParams()

	useEffect(() => {
		if (roomId) {
			setTimeout(() => {
				getRoomById(roomId)
					.then((response) => {
						setSelectedRooms([response])
						setIsLoading(false)
					})
					.catch((error) => {
						setError(error)
						setIsLoading(false)
					})
			}, 1000)
		} else {
			try {
				const storedRooms = JSON.parse(localStorage.getItem("selectedRooms") || "[]")
				const rooms = Array.isArray(storedRooms) ? storedRooms.filter(Boolean) : []
				
				if (rooms.length > 0) {
					setIsLoading(true)
					Promise.all(rooms.map((room) => getRoomById(room.id)))
						.then((fetchedRooms) => {
							setSelectedRooms(fetchedRooms)
							setIsLoading(false)
						})
						.catch((err) => {
							setError(err.message || "Error loading rooms")
							setIsLoading(false)
						})
				} else {
					setSelectedRooms([])
					setIsLoading(false)
				}
			} catch (parseError) {
				console.error("Error parsing selectedRooms from localStorage", parseError)
				setStorageError("Unable to read selected rooms from browser storage. Please clear your storage and try again.")
				setSelectedRooms([])
				setIsLoading(false)
			}
		}
	}, [roomId])

	return (
		<div>
			<section className="container">
				<div className="row">
					<div className="col-md-4 mt-5 mb-5">
						{isLoading ? (
							<p>Loading room information...</p>
						) : error ? (
							<p className="text-danger">{error}</p>
						) : storageError ? (
							<div className="alert alert-danger">{storageError}</div>
						) : selectedRooms.length === 0 ? (
							<div className="alert alert-warning">No rooms selected for booking. Please go back to browse rooms.</div>
						) : (
							<div className="room-info">
								<h4 className="mb-3">Selected Rooms</h4>
								{selectedRooms.filter(Boolean).map((room, index) => (
									<div key={index} className="mb-3 p-2 border rounded shadow-sm bg-white">
										<img
											src={`data:image/png;base64,${room.photo}`}
											alt="Room photo"
											style={{ width: "100%", height: "120px", objectFit: "cover" }}
											className="mb-2"
										/>
										<table className="table table-sm table-bordered mb-0">
											<tbody>
												<tr>
													<th>Type:</th>
													<td>{room.roomType?.name || "N/A"}</td>
												</tr>
												<tr>
													<th>Price:</th>
													<td>{room.price ? room.price.toLocaleString() : "0"} VNĐ / night</td>
												</tr>
											</tbody>
										</table>
									</div>
								))}
								<div className="mt-4 p-3 bg-light rounded">
									<h6>Included Services:</h6>
									<ul className="list-unstyled small">
										{selectedRooms.length > 0 && selectedRooms[0].roomType?.freeServices?.length > 0 ? (
											selectedRooms[0].roomType.freeServices.map((service) => (
												<li key={service.id}>
													<FaCheckCircle className="me-2 hotel-color" /> {service.name}
												</li>
											))
										) : (
											<>
												<li><FaWifi /> Free High-speed Wifi</li>
												<li><FaTv /> Netflix Premium</li>
												<li><FaUtensils /> Daily Breakfast</li>
											</>
										)}
									</ul>
								</div>
							</div>
						)}
					</div>
					<div className="col-md-8">
						<BookingForm selectedRooms={selectedRooms} location={location} />
					</div>
				</div>
			</section>
			<div className="container mt-5">
				{selectedRooms.length > 0 && selectedRooms[0].roomType && (
					<ReviewSection roomTypeId={selectedRooms[0].roomType.id} />
				)}
			</div>
			<div className="container">
				<RoomCarousel />
			</div>
		</div>
	)
}
export default Checkout