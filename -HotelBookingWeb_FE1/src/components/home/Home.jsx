import React, { useState, useEffect } from "react"
import MainHeader from "../layout/MainHeader"
import HotelService from "../common/HotelService"
import Parallax from "../common/Parallax"
import RoomCarousel from "../common/RoomCarousel"
import RoomSearch from "../common/RoomSearch"
import { useLocation } from "react-router-dom"
import { Container } from "react-bootstrap"
import { getAllRooms } from "../utils/ApiFunctions"

const Home = () => {
	const location = useLocation()
	const [rooms, setRooms] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const message = location.state && location.state.message
	const firstName = localStorage.getItem("firstName")
	const lastName = localStorage.getItem("lastName")
	const currentUser = firstName && lastName ? `${firstName} ${lastName}` : localStorage.getItem("userId")
	
	useEffect(() => {
		getAllRooms()
			.then((data) => {
				setRooms(data)
				setIsLoading(false)
			})
			.catch((err) => {
				console.error("Error loading rooms on home:", err)
				setIsLoading(false)
			})
	}, [])

	return (
		<section>
			{message && <p className="alert alert-warning text-center mx-5 mt-3">{message}</p>}
			{currentUser && (
				<h6 className="text-muted text-center mt-3 small"> 
					Logged in as: <span className="hotel-color fw-bold">{currentUser}</span>
				</h6>
			)}
			
			<MainHeader />
			
			<Container>
				<section className="my-5 shadow-sm p-4 bg-white rounded-4" style={{marginTop: "-50px !important", position: "relative", zIndex: "20"}}>
					<RoomSearch />
				</section>

				<section id="rooms" className="my-5">
					<div className="text-center mb-5">
						<h2 className="display-5 hotel-color">Featured Rooms</h2>
						<p className="text-muted">Choose from our selection of premium suites and rooms</p>
					</div>
					<RoomCarousel rooms={rooms} limit={4} isLoading={isLoading} />
				</section>

				<HotelService />

				<Parallax />

				<section className="my-5">
					<div className="text-center mb-5">
						<h2 className="display-5 hotel-color">Luxury & Comfort</h2>
						<p className="text-muted">Explore more of our unique room offerings</p>
					</div>
					<RoomCarousel rooms={rooms.slice(4)} limit={4} isLoading={isLoading} />
				</section>
			</Container>
		</section>
	)
}

export default Home
