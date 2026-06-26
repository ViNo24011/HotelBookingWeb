import React, { useEffect, useState } from "react"
import { getAllRooms } from "../utils/ApiFunctions"
import RoomCard from "./RoomCard"
import { Col, Container, Row } from "react-bootstrap"
import RoomFilter from "../common/RoomFilter"
import RoomPaginator from "../common/RoomPaginator"
import { Link } from "react-router-dom"

const Room = () => {
	const [data, setData] = useState([])
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [roomsPerPage] = useState(6)
	const [filteredData, setFilteredData] = useState([{ id: "" }])
	const [selectedRoomsCount, setSelectedRoomsCount] = useState(0)

	useEffect(() => {
		setIsLoading(true)
		getAllRooms()
			.then((data) => {
				setData(data)
				setFilteredData(data)
				setIsLoading(false)
			})
			.catch((error) => {
				setError(error.message)
				setIsLoading(false)
			})

		const updateCount = () => {
			const rooms = JSON.parse(localStorage.getItem("selectedRooms") || "[]")
			setSelectedRoomsCount(rooms.length)
		}
		updateCount()
		window.addEventListener("cartUpdated", updateCount)
		return () => window.removeEventListener("cartUpdated", updateCount)
	}, [])

	if (isLoading) {
		return <div>Loading rooms.....</div>
	}
	if (error) {
		return <div className=" text-danger">Error : {error}</div>
	}

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
	}

	const totalPages = Math.ceil(filteredData.length / roomsPerPage)

	const renderRooms = () => {
		const startIndex = (currentPage - 1) * roomsPerPage
		const endIndex = startIndex + roomsPerPage
		return filteredData
			.slice(startIndex, endIndex)
			.map((room) => <RoomCard key={room.id} room={room} />)
	}

	return (
		<Container>
			<Row>
				<Col md={6} className="mb-3 mb-md-0">
					<RoomFilter data={data} setFilteredData={setFilteredData} />
				</Col>

				<Col md={6} className="d-flex align-items-center justify-content-end">
					<RoomPaginator
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</Col>
			</Row>

			<Row>{renderRooms()}</Row>

			<Row>
				<Col md={6} className="d-flex align-items-center justify-content-end">
					<RoomPaginator
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</Col>
			</Row>

			{selectedRoomsCount > 0 && (
				<div
					className="fixed-bottom p-3 bg-white border-top shadow d-flex justify-content-around align-items-center"
					style={{ zIndex: 1000 }}>
					<h5 className="mb-0">Selected Rooms: {selectedRoomsCount}</h5>
					<Link to="/checkout" className="btn btn-hotel">
						Proceed to Multi-Room Checkout
					</Link>
				</div>
			)}
		</Container>
	)
}

export default Room
