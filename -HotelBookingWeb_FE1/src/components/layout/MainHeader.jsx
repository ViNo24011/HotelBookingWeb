import React from "react"

const MainHeader = () => {
	return (
		<header className="header-banner">
			<div className="overlay"></div>
			<div className="overlay-content fade-in">
				<h1 className="display-1 text-white text-shadow-lg">
					Welcome to <span className="hotel-color"> lakeSide Hotel</span>
				</h1>
				<h4 className="fw-light mb-4 text-white text-shadow">Experience the Best Hospitality in Town</h4>
				<a href="#rooms" className="btn-hotel">Browse Rooms</a>
			</div>
		</header>
	)
}

export default MainHeader
