import React, { useState, useEffect } from "react"
import { getAllRoomTypes } from "../utils/ApiFunctions"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"

const RoomTypeSelector = ({ handleRoomInputChange, newRoom }) => {
	const [roomTypes, setRoomTypes] = useState([])

	useEffect(() => {
		fetchRoomTypes()
	}, [])

	const fetchRoomTypes = async () => {
		try {
			const data = await getAllRoomTypes()
			setRoomTypes(data)
		} catch (error) {
			console.error(error.message)
		}
	}

	return (
		<div className="input-group">
			<select
				required
				className="form-select"
				name="roomTypeId"
				onChange={handleRoomInputChange}
				value={newRoom.roomTypeId}>
				<option value="">Select a room category...</option>
				{roomTypes.map((type) => (
					<option key={type.id} value={type.id}>
						{type.name}
					</option>
				))}
			</select>
			<Link 
				to="/existing-room-types" 
				className="btn btn-outline-secondary" 
				title="Manage room categories">
				<FaPlus />
			</Link>
		</div>
	)
}

export default RoomTypeSelector
