import React, { useState, useEffect } from "react"
import { addRoom, getRoomTypeById } from "../utils/ApiFunctions"
import RoomTypeSelector from "../common/RoomTypeSelector"
import { Link } from "react-router-dom"
import { FaInfoCircle } from "react-icons/fa"

const AddRoom = () => {
	const [newRoom, setNewRoom] = useState({
		roomTypeId: "",
		roomNumber: ""
	})

	const [selectedTypeDetails, setSelectedTypeDetails] = useState(null)
	const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")

	useEffect(() => {
		if (newRoom.roomTypeId && newRoom.roomTypeId !== "Add New") {
			fetchTypeDetails(newRoom.roomTypeId)
		} else {
			setSelectedTypeDetails(null)
		}
	}, [newRoom.roomTypeId])

	const fetchTypeDetails = async (id) => {
		try {
			const data = await getRoomTypeById(id)
			setSelectedTypeDetails(data)
		} catch (error) {
			console.error("Error fetching type details:", error.message)
		}
	}

	const handleRoomInputChange = (e) => {
		const name = e.target.name
		let value = e.target.value
		setNewRoom({ ...newRoom, [name]: value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await addRoom(newRoom.roomNumber, newRoom.roomTypeId)
			if (response.status === 201) {
				setSuccessMessage("New room has been added successfully!")
				setNewRoom({ roomTypeId: "", roomNumber: "" })
				setSelectedTypeDetails(null)
				setErrorMessage("")
			} else {
				setErrorMessage("Error adding new room")
			}
		} catch (error) {
			setErrorMessage(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setErrorMessage("")
		}, 3000)
	}

	return (
		<>
			<section className="container mt-5 mb-5">
				<div className="row justify-content-center">
					<div className="col-md-8 col-lg-6">
						<h2 className="mt-5 mb-4 text-center">Add New Room</h2>
						
						{successMessage && <div className="alert alert-success fade show"> {successMessage}</div>}
						{errorMessage && <div className="alert alert-danger fade show"> {errorMessage}</div>}

						<form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
							<div className="mb-4">
								<label htmlFor="roomType" className="form-label fw-bold">
									Room Category
								</label>
								<RoomTypeSelector
									handleRoomInputChange={handleRoomInputChange}
									newRoom={newRoom}
								/>
								<small className="text-muted">
									<FaInfoCircle className="me-1" />
									Price and Photo will be automatically updated based on the selected category.
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
											<p className="mb-1"><strong>Price:</strong> {selectedTypeDetails.basePrice.toLocaleString()} VNĐ/night</p>
											<p className="mb-0"><strong>Capacity:</strong> {selectedTypeDetails.maxCapacity} persons</p>
										</div>
									</div>
								</div>
							)}

							<div className="mb-4">
								<label htmlFor="roomNumber" className="form-label fw-bold">
									Room Number
								</label>
								<input
									required
									type="text"
									className="form-control"
									id="roomNumber"
									name="roomNumber"
									placeholder="e.g.: 101, 202..."
									value={newRoom.roomNumber}
									onChange={handleRoomInputChange}
								/>
							</div>

							<div className="d-grid gap-2 d-md-flex justify-content-between mt-4">
								<Link to={"/existing-rooms"} className="btn btn-outline-secondary">
									Back to List
								</Link>
								<button type="submit" className="btn btn-hotel px-5">
									Save Room
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</>
	)
}

export default AddRoom
