import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "react-bootstrap"
import Header from "../common/Header"

const BookingSuccess = () => {
	const location = useLocation()
	const message = location.state?.message
	const error = location.state?.error
	return (
		<div className="container">
			<Header title="Booking Success" />
			<div className="mt-5">
				{message ? (
					<div className="text-center py-4">
						<h3 className="text-success mb-3"> Booking Success!</h3>
						<p className="text-success fs-5">{message}</p>
						<Link to={"/profile"} className="btn btn-hotel mt-3">
							View Booking History
						</Link>
					</div>
				) : (
					<div className="text-center py-4">
						<h3 className="text-danger mb-3"> Error Booking Room!</h3>
						<div className="alert alert-danger d-inline-block px-5">
							{error || "Sorry, an error occurred or the session has expired. Please try the booking process again."}
						</div>
						<div className="mt-4">
							<Link to={"/"} className="btn btn-outline-hotel me-3">
								Back to Home
							</Link>
							<Button variant="hotel" onClick={() => window.history.back()}>
								Try previous step
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default BookingSuccess
