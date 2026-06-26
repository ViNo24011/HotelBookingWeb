import React, { useEffect, useState } from "react"
import { getRoomById, updateRoom, getRoomTypeById } from "../utils/ApiFunctions"
import { Link, useParams } from "react-router-dom"
import RoomTypeSelector from "../common/RoomTypeSelector"
import { FaInfoCircle } from "react-icons/fa"

const EditRoom = () => {
	const [room, setRoom] = useState({
		roomTypeId: "",
		roomNumber: ""
	})

	const [selectedTypeDetails, setSelectedTypeDetails] = useState(null)
	const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const { roomId } = useParams()

	const handleInputChange = (event) => {
		const { name, value } = event.target
		setRoom({ ...room, [name]: value })
	}

	useEffect(() => {
		const fetchRoom = async () => {
			try {
				const roomData = await getRoomById(roomId)
				setRoom({
					roomTypeId: roomData.roomType?.id || "",
					roomNumber: roomData.roomNumber
				})
			} catch (error) {
				console.error(error)
			}
		}
		fetchRoom()
	}, [roomId])

	useEffect(() => {
		if (room.roomTypeId && room.roomTypeId !== "Add New") {
			fetchTypeDetails(room.roomTypeId)
		} else {
			setSelectedTypeDetails(null)
		}
	}, [room.roomTypeId])

	const fetchTypeDetails = async (id) => {
		try {
			const data = await getRoomTypeById(id)
			setSelectedTypeDetails(data)
		} catch (error) {
			console.error("Error fetching type details:", error.message)
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await updateRoom(roomId, room)
			if (response.status === 200) {
				setSuccessMessage("Room information updated successfully!")
				setErrorMessage("")
			} else {
				setErrorMessage("Error updating room information")
			}
		} catch (error) {
			console.error(error)
			setErrorMessage(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setErrorMessage("")
		}, 3000)
	}

	return (
		<div className="container mt-5 mb-5">
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					<h2 className="text-center mb-4 mt-5">Edit Room</h2>
					
					{successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
					{errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
					
					<form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
						<div className="mb-4">
							<label htmlFor="roomNumber" className="form-label fw-bold">
								Room Number
							</label>
							<input
								type="text"
								className="form-control"
								id="roomNumber"
								name="roomNumber"
								value={room.roomNumber}
								onChange={handleInputChange}
							/>
						</div>
						
						<div className="mb-4">
							<label htmlFor="roomType" className="form-label fw-bold">
								Room Category
							</label>
							<RoomTypeSelector 
								handleRoomInputChange={handleInputChange} 
								newRoom={room} 
							/>
							<small className="text-muted">
								<FaInfoCircle className="me-1" />
								Note: Price and Photo will automatically update based on the selected category.
							</small>
						</div>

						{selectedTypeDetails && (
							<div className="mb-4 p-3 border rounded bg-light fade-in">
								<h6 className="fw-bold mb-3">Room Category Preview:</h6>
								<div className="d-flex gap-3">
									{selectedTypeDetails.photo && (
										<img
											src={`data:image/png;base64,${selectedTypeDetails.photo}`}
											alt="Preview"
											style={{ width: "120px", height: "80px", objectFit: "cover" }}
											className="rounded shadow-sm"
										/>
									)}
									<div>
										<p className="mb-1"><strong>Price:</strong> {selectedTypeDetails.basePrice ? selectedTypeDetails.basePrice.toLocaleString() : "0"} VNĐ/night</p>
										<p className="mb-0"><strong>Capacity:</strong> {selectedTypeDetails.maxCapacity} persons</p>
									</div>
								</div>
							</div>
						)}

						<div className="d-grid gap-2 d-md-flex justify-content-between mt-4">
							<Link to={"/existing-rooms"} className="btn btn-outline-secondary">
								Back to Hub
							</Link>
							<button type="submit" className="btn btn-hotel px-4">
								Update Room
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default EditRoom
