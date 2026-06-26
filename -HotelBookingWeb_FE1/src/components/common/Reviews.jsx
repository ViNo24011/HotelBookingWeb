import React, { useState, useEffect } from "react"
import { getAllRoomTypes, getAllReviews, getReviewsByRoomType, voteReview } from "../utils/ApiFunctions"
import { Container, Row, Col, Card, Badge } from "react-bootstrap"
import { FaStar, FaThumbsUp, FaThumbsDown, FaQuoteLeft, FaCalendarAlt, FaUserCircle } from "react-icons/fa"
import moment from "moment"
import RoomPaginator from "./RoomPaginator"

const Reviews = () => {
	const [reviews, setReviews] = useState([])
	const [roomTypes, setRoomTypes] = useState([])
	const [selectedRoomType, setSelectedRoomType] = useState("")
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(0)
	const [totalElements, setTotalElements] = useState(0)
	const reviewsPerPage = 6

	const userId = localStorage.getItem("userId")
	const isLoggedIn = !!userId

	useEffect(() => {
		fetchRoomTypes()
	}, [])

	useEffect(() => {
		fetchReviews(currentPage - 1)
	}, [currentPage, selectedRoomType])

	const fetchRoomTypes = async () => {
		try {
			const types = await getAllRoomTypes()
			setRoomTypes(types)
		} catch (error) {
			console.error("Error fetching room types:", error)
		}
	}

	const fetchReviews = async (page) => {
		setIsLoading(true)
		try {
			let data
			if (selectedRoomType) {
				data = await getReviewsByRoomType(selectedRoomType, page, reviewsPerPage)
			} else {
				data = await getAllReviews(page, reviewsPerPage)
			}
			setReviews(data.content)
			setTotalPages(data.totalPages)
			setTotalElements(data.totalElements)
		} catch (error) {
			setError(error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleVote = async (reviewId, voteType) => {
		if (!isLoggedIn) {
			alert("Vui lòng đăng nhập để tương tác với đánh giá này.")
			return
		}
		try {
			await voteReview(userId, reviewId, voteType)
			fetchReviews(currentPage - 1)
		} catch (error) {
			alert(error.message)
		}
	}

	const handleRoomTypeChange = (e) => {
		setSelectedRoomType(e.target.value)
		setCurrentPage(1)
	}

	const renderStars = (rating) => {
		return [...Array(5)].map((_, index) => (
			<FaStar key={index} color={index < rating ? "#ffc107" : "#e4e5e9"} />
		))
	}

	const formatReviewDate = (dateArray) => {
		if (!dateArray) return "N/A"
		// Nếu là array [year, month, day, ...]
		if (Array.isArray(dateArray)) {
			const [year, month, day] = dateArray
			return moment([year, month - 1, day]).format("MMM Do, YYYY")
		}
		return moment(dateArray).format("MMM Do, YYYY")
	}

	if (isLoading && reviews.length === 0) {
		return (
			<Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
				<div className="spinner-border hotel-color" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</Container>
		)
	}

	return (
		<Container className="my-5 fade-in">
			<div className="text-center mb-5">
				<h1 className="fw-bold display-4 hotel-color mb-2">Guest Experiences</h1>
				<p className="text-muted lead">Real stories from our valued guests about their stay at LakeSide Hotel</p>
				
				<div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-4">
					<div className="d-flex gap-2">
						<Badge bg="light" text="dark" className="p-2 border px-3 rounded-pill shadow-sm d-flex align-items-center">
							<span className="fw-bold text-primary me-1">{totalElements}</span> Reviews
						</Badge>
					</div>

					<div className="filter-container" style={{ minWidth: "250px" }}>
						<select 
							className="form-select rounded-pill shadow-sm border-light"
							value={selectedRoomType}
							onChange={handleRoomTypeChange}
						>
							<option value="">All Room Categories</option>
							{roomTypes.map((type) => (
								<option key={type.id} value={type.id}>{type.name}</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{error && <p className="alert alert-danger">{error}</p>}

			<Row className="g-4 mb-5">
				{reviews.length > 0 ? (
					reviews.map((review) => (
						<Col key={review.id} md={6} lg={4}>
							<Card className="h-100 border-0 shadow-sm rounded-4 hover-lift transition-all">
								<Card.Body className="p-4 d-flex flex-column">
									<div className="d-flex justify-content-between align-items-start mb-3">
										<div className="d-flex align-items-center gap-2">
											<div className="bg-light p-2 rounded-circle">
												<FaUserCircle size={24} className="text-muted" />
											</div>
											<div>
												<h6 className="mb-0 fw-bold">{review.reviewerName}</h6>
												<small className="text-muted d-flex align-items-center gap-1">
													<FaCalendarAlt size={10} /> {formatReviewDate(review.createdAt)}
												</small>
											</div>
										</div>
										<Badge bg="primary-subtle" text="primary" className="rounded-pill px-2 py-1 small border border-primary-subtle">
											{review.roomTypeName}
										</Badge>
									</div>

									<div className="mb-3">{renderStars(review.rating)}</div>

									<div className="position-relative mb-4 flex-grow-1">
										<FaQuoteLeft className="position-absolute opacity-10" size={24} style={{top: -5, left: -5}} />
										<p className="card-text text-secondary font-italic ps-3 pt-2" style={{lineHeight: "1.6"}}>
											"{review.comment}"
										</p>
									</div>

									<hr className="opacity-10 my-3" />

									<div className="d-flex justify-content-between align-items-center">
										<small className="text-muted">Was this helpful?</small>
										<div className="d-flex gap-3">
											<button 
												className="btn btn-sm btn-outline-success border-0 rounded-pill px-2 d-flex align-items-center gap-1"
												onClick={() => handleVote(review.id, 1)}
											>
												<FaThumbsUp /> {review.helpfulScore > 0 ? review.helpfulScore : 0}
											</button>
											<button 
												className="btn btn-sm btn-outline-danger border-0 rounded-pill px-2 d-flex align-items-center gap-1"
												onClick={() => handleVote(review.id, -1)}
											>
												<FaThumbsDown /> {review.helpfulScore < 0 ? Math.abs(review.helpfulScore) : 0}
											</button>
										</div>
									</div>
								</Card.Body>
							</Card>
						</Col>
					))
				) : (
					<Col className="text-center py-5">
						<div className="bg-light d-inline-block p-4 rounded-circle mb-3">
							<FaQuoteLeft className="display-4 text-muted opacity-50" />
						</div>
						<h4 className="text-muted">No reviews found</h4>
						<p className="text-muted small">Try selecting a different room category or be the first to review!</p>
					</Col>
				)}
			</Row>

			{totalPages > 1 && (
				<div className="d-flex justify-content-center mt-5">
					<RoomPaginator 
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</div>
			)}
		</Container>
	)
}

export default Reviews