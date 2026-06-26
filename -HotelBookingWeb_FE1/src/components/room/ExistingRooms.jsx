import React, { useEffect, useState } from "react"
import { deleteRoom, getAllRooms } from "../utils/ApiFunctions"
import { Col, Row } from "react-bootstrap"
import RoomFilter from "../common/RoomFilter"
import RoomPaginator from "../common/RoomPaginator"
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa"
import { Link } from "react-router-dom"

const ExistingRooms = () => {
	const [rooms, setRooms] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [roomsPerPage] = useState(8)
	const [isLoading, setIsLoading] = useState(false)
	const [filteredRooms, setFilteredRooms] = useState([])
	const [selectedRoomType, setSelectedRoomType] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")

	useEffect(() => {
		fetchRooms()
	}, [])

	const fetchRooms = async () => {
		setIsLoading(true)
		try {
			const result = await getAllRooms()
			setRooms(result)
			setIsLoading(false)
		} catch (error) {
			setErrorMessage(error.message)
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (selectedRoomType === "") {
			setFilteredRooms(rooms)
		} else {
			const filteredRooms = rooms.filter((room) => 
				room.roomType && room.roomType.name === selectedRoomType
			)
			setFilteredRooms(filteredRooms)
		}
		setCurrentPage(1)
	}, [rooms, selectedRoomType])

	const handlePaginationClick = (pageNumber) => {
		setCurrentPage(pageNumber)
	}

	const handleDelete = async (roomId) => {
		try {
			const result = await deleteRoom(roomId)
			if (result === "") {
				setSuccessMessage(`Room No ${roomId} was delete`)
				fetchRooms()
			} else {
				console.error(`Error deleting room : ${result.message}`)
			}
		} catch (error) {
			setErrorMessage(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setErrorMessage("")
		}, 3000)
	}

	const calculateTotalPages = (filteredRooms, roomsPerPage, rooms) => {
		const totalRooms = filteredRooms.length > 0 ? filteredRooms.length : rooms.length
		return Math.ceil(totalRooms / roomsPerPage)
	}

	const indexOfLastRoom = currentPage * roomsPerPage
	const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
	const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom)

	return (
		<>
			<div className="container col-md-8 col-lg-6">
				{successMessage && <p className="alert alert-success mt-5">{successMessage}</p>}

				{errorMessage && <p className="alert alert-danger mt-5">{errorMessage}</p>}
			</div>

			{isLoading ? (
				<p>Loading existing rooms</p>
			) : (
				<>
					<section className="mt-5 mb-5 container p-4 bg-white shadow-sm rounded-4">
						<div className="d-flex justify-content-between align-items-center mb-5 mt-2">
							<h2 className="hotel-color h1">Existing Rooms</h2>
							<Link to={"/add-room"} className="btn btn-hotel d-flex align-items-center gap-2">
								<FaPlus /> Add New Room
							</Link>
						</div>

						<Row className="mb-4 align-items-center">
							<Col md={6}>
								<RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
							</Col>
						</Row>

						<div className="table-responsive">
							<table className="table table-hover align-middle">
								<thead>
									<tr className="text-center">
										<th>ID</th>
										<th>Photo</th>
										<th>Room Type</th>
										<th>Room Price</th>
										<th>Actions</th>
									</tr>
								</thead>

								<tbody>
									{currentRooms.map((room) => (
										<tr key={room.id} className="text-center">
											<td className="fw-bold">{room.id}</td>
											<td>
												{room.photo ? (
													<img
														src={`data:image/png;base64,${room.photo}`}
														alt="Room"
														style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
													/>
												) : (
													<div className="bg-light text-muted small py-2 rounded" style={{ width: "60px" }}>No Photo</div>
												)}
											</td>
											<td>{room.roomType ? room.roomType.name : "N/A"}</td>
											<td className="hotel-color fw-semibold">
												{room.price ? room.price.toLocaleString() : "0"} VNĐ
											</td>
											<td>
												<div className="d-flex justify-content-center gap-2">
													<Link to={`/edit-room/${room.id}`} className="btn btn-outline-info btn-sm rounded-circle p-2 d-inline-flex">
														<FaEdit title="Edit Room" />
													</Link>
													<button
														className="btn btn-outline-danger btn-sm rounded-circle p-2 d-inline-flex"
														onClick={() => handleDelete(room.id)}>
														<FaTrashAlt title="Delete Room" />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<RoomPaginator
							currentPage={currentPage}
							totalPages={calculateTotalPages(filteredRooms, roomsPerPage, rooms)}
							onPageChange={handlePaginationClick}
						/>
					</section>
				</>
			)}
		</>
	)
}

export default ExistingRooms
