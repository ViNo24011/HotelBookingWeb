import React, { useState, useEffect } from "react"
import { getReviewsByRoomType, addReview, voteReview } from "../utils/ApiFunctions"
import { FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa"
import moment from "moment"
import { Form, Button, Alert } from "react-bootstrap"

const ReviewSection = ({ roomTypeId }) => {
    const [reviews, setReviews] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const userId = localStorage.getItem("userId")
    const isLoggedIn = !!userId

    useEffect(() => {
        if (roomTypeId) {
            fetchReviews()
        }
    }, [roomTypeId])

    const fetchReviews = async () => {
        setIsLoading(true)
        try {
            const data = await getReviewsByRoomType(roomTypeId)
            const reviewList = Array.isArray(data) ? data : data?.content || []
            setReviews(reviewList)
        } catch (error) {
            setError(error.message)
        }
        setIsLoading(false)
    }

    const handleVote = async (reviewId, voteType) => {
        if (!isLoggedIn) {
            alert("Please log in to vote.")
            return
        }
        try {
            await voteReview(userId, reviewId, voteType)
            fetchReviews() // refresh counts
        } catch (error) {
            alert(error.message)
        }
    }



    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar key={index} color={index < rating ? "#ffc107" : "#e4e5e9"} />
        ))
    }

    return (
        <div className="mt-5 mb-5 p-4 bg-light rounded shadow-sm">
            <h3 className="hotel-color mb-4">Guest Reviews</h3>
            
            {/* Reviews List */}
            {isLoading ? (
                <p>Loading reviews...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : reviews.length === 0 ? (
                <p>No reviews yet for this room type. Be the first to review!</p>
            ) : (
                <div className="mb-5">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-bottom pb-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong>{review.reviewerName}</strong>
                                <span className="text-muted small">{moment(review.createdAt).format("MMM Do YYYY")}</span>
                            </div>
                            <div className="mb-2">{renderStars(review.rating)}</div>
                            <p>{review.comment}</p>
                            <div className="d-flex gap-3 text-muted small">
                                <span style={{cursor: "pointer"}} onClick={() => handleVote(review.id, 1)}>
                                    <FaThumbsUp className="me-1" /> {review.helpfulScore || 0}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

		</div>
	)
}

export default ReviewSection