import React from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import ExistingRooms from "./components/room/ExistingRooms"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/home/Home"
import EditRoom from "./components/room/EditRoom"
import AddRoom from "./components/room/AddRoom"
import ExistingRoomTypes from "./components/room/ExistingRoomTypes"
import AdminDashboard from "./components/admin/AdminDashboard"
import NavBar from "./components/layout/NavBar"
import Footer from "./components/layout/Footer"
import RoomListing from "./components/room/RoomListing"
import Admin from "./components/admin/Admin"
import ManageServices from "./components/admin/ManageServices"
import Checkout from "./components/booking/Checkout"
import BookingSuccess from "./components/booking/BookingSuccess"
import Bookings from "./components/booking/Bookings"
import FindBooking from "./components/booking/FindBooking"
import QRPayment from "./components/booking/QRPayment"
import Login from "./components/auth/Login"
import Registration from "./components/auth/Registration"
import Profile from "./components/auth/Profile"
import { AuthProvider } from "./components/auth/AuthProvider"
import RequireAuth from "./components/auth/RequireAuth"
import ChangePassword from "./components/auth/ChangePassword"
import VerifyEmail from "./components/auth/VerifyEmail"
import AboutUs from "./components/common/AboutUs"
import HotelRules from "./components/common/HotelRules"
import Reviews from "./components/common/Reviews"

function App() {
	return (
		<AuthProvider>
			<main>
				<Router>
					<NavBar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/edit-room/:roomId" element={<EditRoom />} />
						<Route path="/existing-rooms" element={<ExistingRooms />} />
						<Route path="/add-room" element={<AddRoom />} />

						<Route
							path="/book-room/:roomId"
							element={
								<RequireAuth>
									<Checkout />
								</RequireAuth>
							}
						/>
						<Route path="/browse-all-rooms" element={<RoomListing />} />

						<Route path="/admin" element={<Admin />} />
						<Route path="/manage-services" element={<ManageServices />} />
						<Route path="/existing-room-types" element={<ExistingRoomTypes />} />
						<Route path="/admin-dashboard" element={<AdminDashboard />} />
						<Route path="/checkout" element={<Checkout />} />
						<Route path="/booking-success" element={<BookingSuccess />} />
						<Route path="/existing-bookings" element={<Bookings />} />
						<Route path="/find-booking" element={<FindBooking />} />
						<Route path="/payment/qr" element={<QRPayment />} />

						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Registration />} />

						<Route path="/profile" element={<Profile />} />
						<Route path="/change-password" element={<ChangePassword />} />
						<Route path="/verify-email" element={<VerifyEmail />} />
						<Route path="/logout" element={<FindBooking />} />
						<Route path="/about-us" element={<AboutUs />} />
						<Route path="/hotel-rules" element={<HotelRules />} />
						<Route path="/reviews" element={<Reviews />} />
					</Routes>
					<Footer />
				</Router>
			</main>
		</AuthProvider>
	)
}

export default App
