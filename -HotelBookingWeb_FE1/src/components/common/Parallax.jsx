import React from "react"
import { Container } from "react-bootstrap"

const Parallax = () => {
	return (
		<div className="parallax mb-5 shadow-lg overflow-hidden">
			<div className="overlay" style={{backgroundColor: "rgba(15, 23, 42, 0.6)"}}></div>
			<Container className="text-center px-5 py-5 justify-content-center position-relative">
				<div className="fade-in">
					<h2 className="display-4 text-white fw-bold mb-3 text-shadow">
						Experience the Best hospitality at <span className="hotel-color">lakeSide Hotel</span>
					</h2>
					<p className="lead text-white text-shadow">We offer the best services for all your needs with premium standards.</p>
				</div>
			</Container>
		</div>
	)
}

export default Parallax
