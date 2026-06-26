import React, { useState } from "react"

const RoomFilter = ({ data, setFilteredData }) => {
	const [filter, setFilter] = useState("")

	const handleSelectChange = (e) => {
		const selectedType = e.target.value
		setFilter(selectedType)

		const filteredRooms = data.filter((room) => {
			if (selectedType === "") return true
			return room.roomType && room.roomType.name.toLowerCase().includes(selectedType.toLowerCase())
		})
		setFilteredData(filteredRooms)
	}

	const clearFilter = () => {
		setFilter("")
		setFilteredData(data)
	}

	const roomTypes = ["", ...new Set(data.filter(room => room && room.roomType).map((room) => room.roomType.name))]

	return (
		<div className="input-group mb-3">
			<span className="input-group-text" id="room-type-filter">
				FIlter rooms by type
			</span>
			<select
				className="form-select"
				aria-label="romm type filter"
				value={filter}
				onChange={handleSelectChange}>
				<option value="">select a room type to filter....</option>
				{roomTypes.map((type, index) => (
					<option key={index} value={String(type)}>
						{String(type)}
					</option>
				))}
			</select>
			<button className="btn btn-hotel" type="button" onClick={clearFilter}>
				Clear Filter
			</button>
		</div>
	)
}
export default RoomFilter
