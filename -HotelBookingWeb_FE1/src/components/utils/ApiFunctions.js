import axios from "axios"

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9192"
})

export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization: `Bearer ${token}`
	}
}


/* This function gets all room types from thee database */
export async function getAllRoomTypes() {
	try {
		const response = await api.get("/room-types/all")
		return response.data
	} catch (error) {
		throw new Error("Error fetching room types")
	}
}

/* This function adds a new room type to the database */
export async function addRoomType(roomTypeData) {
	try {
		const formData = new FormData()
		formData.append("name", roomTypeData.name)
		formData.append("basePrice", roomTypeData.basePrice)
		formData.append("maxCapacity", roomTypeData.maxCapacity)
		formData.append("description", roomTypeData.description)

		if (roomTypeData.serviceIds) {
			roomTypeData.serviceIds.forEach((id) => formData.append("serviceIds", id))
		}
		if (roomTypeData.photo) {
			formData.append("photo", roomTypeData.photo)
		}

		const response = await api.post("/room-types/add", formData, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		const errorMessage = error.response?.data?.message || error.message || "Error adding room type"
		throw new Error(errorMessage)
	}
}

/* This function updates a room type */
export async function updateRoomType(id, roomTypeData) {
	try {
		const formData = new FormData()
		if (roomTypeData.name) formData.append("name", roomTypeData.name)
		if (roomTypeData.basePrice) formData.append("basePrice", roomTypeData.basePrice)
		if (roomTypeData.maxCapacity) formData.append("maxCapacity", roomTypeData.maxCapacity)
		if (roomTypeData.description) formData.append("description", roomTypeData.description)
		if (roomTypeData.photo) formData.append("photo", roomTypeData.photo)
		if (roomTypeData.serviceIds) {
			roomTypeData.serviceIds.forEach((id) => formData.append("serviceIds", id))
		}

		const response = await api.put(`/room-types/update/${id}`, formData, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		const errorMessage = error.response?.data?.message || error.message || "Error updating room type"
		throw new Error(errorMessage)
	}
}

/* This function deletes a room type */
export async function deleteRoomType(id) {
	try {
		const response = await api.delete(`/room-types/delete/${id}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		const errorMessage = error.response?.data?.message || error.message || "Error deleting room type"
		throw new Error(errorMessage)
	}
}

/* This function adds a new room to the database */
export async function addRoom(roomNumber, roomTypeId) {
	try {
		const formData = new FormData()
		formData.append("roomNumber", roomNumber)
		formData.append("roomTypeId", roomTypeId)

		const response = await api.post("/rooms/add/new-room", formData, {
			headers: getHeader()
		})
		return response
	} catch (error) {
		const errorMessage = error.response?.data?.message || error.message || "Error adding room"
		throw new Error(errorMessage)
	}
}

/* This function gets all rooms from the database */
export async function getAllRooms() {
	try {
		const response = await api.get("/rooms/all-rooms")
		return response.data
	} catch (error) {
		throw new Error("Error fetching rooms")
	}
}

/* This function gets a room type by id from the database */
export async function getRoomTypeById(id) {
	try {
		const response = await api.get(`/room-types/${id}`)
		return response.data
	} catch (error) {
		throw new Error("Error fetching room type")
	}
}

/* This function deletes a room by the Id */
export async function deleteRoom(roomId) {
	try {
		const result = await api.delete(`/rooms/delete/room/${roomId}`, {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error deleting room ${error.message}`)
	}
}
/* This function updates a room */
export async function updateRoom(roomId, roomData) {
	try {
		const formData = new FormData()
		if (roomData.roomNumber) formData.append("roomNumber", roomData.roomNumber)
		if (roomData.roomTypeId) formData.append("roomTypeId", roomData.roomTypeId)

		const response = await api.put(`/rooms/update/${roomId}`, formData, {
			headers: getHeader()
		})
		return response
	} catch (error) {
		const errorMessage = error.response?.data?.message || error.message || "Error updating room"
		throw new Error(errorMessage)
	}
}

/* This funcction gets a room by the id */
export async function getRoomById(roomId) {
	try {
		const result = await api.get(`/rooms/room/${roomId}`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching room ${error.message}`)
	}
}

/* This function saves a new booking to the database (Unified multi-room booking) */
export async function bookRoom(bookingRequest) {
	try {
		const response = await api.post("/bookings/book", bookingRequest)
		return response.data
	} catch (error) {
		console.error("DEBUG: bookRoom caught error:", error)
		if (error.response && error.response.data) {
			const errorData = error.response.data
			// Nếu server trả về object { message: "..." } hoặc chuỗi thuần túy
			const msg = errorData.message || (typeof errorData === "string" ? errorData : JSON.stringify(errorData))
			throw new Error(msg)
		} else {
			throw new Error(error.message || "Không thể kết nối đến máy chủ.")
		}
	}
}

export async function getAllBookings() {
	try {
		const result = await api.get("/bookings/all-bookings", {
			headers: {
				...getHeader(),
				"Content-Type": "application/json"
			}
		})
		return result.data
	} catch (error) {
		throw new Error(`Error fetching bookings : ${error.message}`)
	}
}

/* This function get booking by the cnfirmation code */
export async function getBookingByConfirmationCode(confirmationCode) {
	try {
		const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
		return result.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error find booking : ${error.message}`)
		}
	}
}

/* This function register a new user */
export async function registerUser(registration) {
	try {
		const response = await api.post("/auth/register", registration)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			const errorData = error.response.data
			let errorMessage = ""
			if (typeof errorData === "string") {
				errorMessage = errorData
			} else if (errorData.message) {
				errorMessage = errorData.message
			} else if (errorData.error) {
				errorMessage = `Server Error: ${errorData.error}`
			} else {
				errorMessage = JSON.stringify(errorData)
			}
			throw new Error(errorMessage)
		} else {
			throw new Error(`User registration error : ${error.message}`)
		}
	}
}

/* This function login a registered user */
export async function loginUser(login) {
	try {
		const response = await api.post("/auth/login", login)
		if (response.status >= 200 && response.status < 300) {
			return response.data
		} else {
			return null
		}
	} catch (error) {
		console.error(error)
		return null
	}
}

/*  This is function to get the user profile */
export async function getUserProfile(email, token) {
	try {
		const response = await api.get(`users/${email}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

/* This is the function to delete a user */
export async function deleteUser(email) {
	try {
		const response = await api.delete(`/users/delete/${email}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		return error.message
	}
}

/* This is the function to get a single user */
export async function getUser(email, token) {
	try {
		const response = await api.get(`/users/${email}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

/* This is the function to get user bookings by the user email */
export async function getBookingsByUserId(email, token) {
	try {
		const response = await api.get(`/bookings/user/${email}/bookings`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("Failed to fetch bookings")
	}
}

/* This function changes the user password */
export async function changePassword(userId, changePasswordRequest) {
	try {
		const response = await api.post(`/users/change-password/${userId}`, changePasswordRequest, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Change password error : ${error.message}`)
		}
	}
}

/* This function verifies the user email */
export async function verifyEmail(email, code) {
	try {
		const response = await api.post("/auth/verify-otp", null, {
			params: { email: email, otp: code }
		})
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			const errorData = error.response.data
			let errorMessage = ""
			if (typeof errorData === "string") {
				errorMessage = errorData
			} else if (errorData.message) {
				errorMessage = errorData.message
			} else if (errorData.error) {
				errorMessage = `Server Error: ${errorData.error}`
			} else {
				errorMessage = JSON.stringify(errorData)
			}
			throw new Error(errorMessage)
		} else {
			throw new Error(`Email verification error : ${error.message}`)
		}
	}
}

/* This function gets the dashboard statistics for admin */
export async function getStatistics() {
	try {
		const response = await api.get("/statistics/dashboard-summary", {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw new Error(`Error fetching statistics : ${error.message}`)
	}
}

/* ======================= NEW SERVICES API ======================= */

export async function getAllServices() {
	try {
		const response = await api.get('/services/all', {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw new Error('Error fetching all services')
	}
}

export async function getActiveServices() {
	try {
		const response = await api.get('/services/active')
		return response.data
	} catch (error) {
		throw new Error('Error fetching active services')
	}
}

export async function addService(serviceData) {
	try {
		const formData = new FormData()
		formData.append('name', serviceData.name)
		formData.append('price', serviceData.price)
		if (serviceData.description) formData.append('description', serviceData.description)
		if (serviceData.unit) formData.append('unit', serviceData.unit)

		const response = await api.post('/services/add', formData, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw new Error('Error adding service')
	}
}

export async function updateService(id, serviceData) {
	try {
		const formData = new FormData()
		if (serviceData.name) formData.append('name', serviceData.name)
		if (serviceData.price) formData.append('price', serviceData.price)
		if (serviceData.description) formData.append('description', serviceData.description)
		if (serviceData.unit) formData.append('unit', serviceData.unit)
		if (serviceData.isActive !== undefined) formData.append('isActive', serviceData.isActive)

		const response = await api.put(`/services/update/${id}`, formData, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw new Error('Error updating service')
	}
}

export async function deleteService(id) {
	try {
		const response = await api.delete(`/services/delete/${id}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw new Error('Error deleting service')
	}
}

/* ======================= NEW REVIEWS API ======================= */

export async function getReviewsByRoomType(roomTypeId, page = 0, size = 10) {
	try {
		const response = await api.get(`/reviews/room-type/${roomTypeId}?page=${page}&size=${size}`)
		return response.data
	} catch (error) {
		throw new Error('Error fetching reviews')
	}
}

export async function getAllReviews(page = 0, size = 10) {
	try {
		const response = await api.get(`/reviews/all?page=${page}&size=${size}`)
		return response.data
	} catch (error) {
		throw new Error("Error fetching reviews")
	}
}

export async function addReview(userId, reviewData) {
	try {
		const response = await api.post(`/reviews/user/${userId}/add`, reviewData, {
			headers: {
				...getHeader(),
				'Content-Type': 'application/json'
			}
		})
		return response.data
	} catch (error) {
		throw new Error(error.response?.data || 'Error submitting review')
	}
}

export async function voteReview(userId, reviewId, voteType) {
	try {
		const response = await api.post(`/reviews/user/${userId}/vote/${reviewId}?voteType=${voteType}`, null, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw new Error(error.response?.data || 'Error voting review')
	}
}

export async function completeBooking(bookingId) {
	try {
		const result = await api.put(`/bookings/booking/${bookingId}/complete`, {}, {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error completing booking :${error.message}`)
	}
}

/* This is the function to cancel user booking */
export async function cancelBooking(bookingId) {
	try {
		const result = await api.delete(`/bookings/booking/${bookingId}/delete`, {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error cancelling booking :${error.message}`)
	}
}

export async function deleteBookingByConfirmationCode(confirmationCode) {
	try {
		const result = await api.delete(`/bookings/confirmation/${confirmationCode}/delete`)
		return result.data
	} catch (error) {
		throw new Error(`Error deleting booking :${error.message}`)
	}
}

export async function getAvailableRooms(checkInDate, checkOutDate, roomTypeId) {
	const url = roomTypeId 
		? `rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomTypeId=${roomTypeId}`
		: `rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
	
	const result = await api.get(url)
	return result
}
