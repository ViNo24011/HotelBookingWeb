import React, { useEffect, useState } from "react"
import { getStatistics } from "../utils/ApiFunctions"
import { Col, Row, Card, Container, Spinner } from "react-bootstrap"
import { FaBed, FaCalendarCheck, FaMoneyBillWave, FaUsers, FaArrowLeft } from "react-icons/fa"
import { Link } from "react-router-dom"
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	Legend
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const AdminDashboard = () => {
	const [stats, setStats] = useState({
		totalRooms: 0,
		totalBookings: 0,
		totalRevenue: 0,
		totalUsers: 0,
		monthlyData: [],
		roomTypeData: []
	})
	const [isLoading, setIsLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState("")

	useEffect(() => {
		fetchStats()
	}, [])

	const fetchStats = async () => {
		try {
			const data = await getStatistics()
			setStats(data)
			setIsLoading(false)
		} catch (error) {
			setErrorMessage(error.message)
			setIsLoading(false)
		}
	}

	if (isLoading) {
		return (
			<Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
				<Spinner animation="border" variant="hotel" />
				<span className="ms-3">Loading statistics...</span>
			</Container>
		)
	}

	return (
		<Container className="mt-5 mb-5 ripple-fade-in">
			<Row className="mb-4 align-items-center">
				<Col>
					<div className="d-flex align-items-center">
						<Link
							to={"/admin"}
							className="btn btn-outline-hotel me-3 rounded-circle"
							style={{
								width: "45px",
								height: "45px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}>
							<FaArrowLeft />
						</Link>
						<h2 className="header-title mb-0">Hotel Statistics</h2>
					</div>
				</Col>
			</Row>

			{errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

			<Row className="g-4 mb-5">
				<Col md={3}>
					<Card className="dashboard-card border-0 shadow-sm h-100">
						<Card.Body className="d-flex align-items-center">
							<div className="icon-container bg-primary-light text-primary me-3">
								<FaMoneyBillWave size={24} />
							</div>
							<div>
								<div className="text-muted small fw-bold text-uppercase">Revenue</div>
								<div className="h4 mb-0 fw-bold">
									{stats.totalRevenue ? stats.totalRevenue.toLocaleString() : 0} <small>VNĐ</small>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={3}>
					<Card className="dashboard-card border-0 shadow-sm h-100">
						<Card.Body className="d-flex align-items-center">
							<div className="icon-container bg-success-light text-success me-3">
								<FaCalendarCheck size={24} />
							</div>
							<div>
								<div className="text-muted small fw-bold text-uppercase">Total Bookings</div>
								<div className="h4 mb-0 fw-bold">{stats.totalBookings}</div>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={3}>
					<Card className="dashboard-card border-0 shadow-sm h-100">
						<Card.Body className="d-flex align-items-center">
							<div className="icon-container bg-info-light text-info me-3">
								<FaBed size={24} />
							</div>
							<div>
								<div className="text-muted small fw-bold text-uppercase">Total Rooms</div>
								<div className="h4 mb-0 fw-bold">{stats.totalRooms}</div>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={3}>
					<Card className="dashboard-card border-0 shadow-sm h-100">
						<Card.Body className="d-flex align-items-center">
							<div className="icon-container bg-warning-light text-warning me-3">
								<FaUsers size={24} />
							</div>
							<div>
								<div className="text-muted small fw-bold text-uppercase">Members</div>
								<div className="h4 mb-0 fw-bold">{stats.totalUsers}</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Charts Section */}
			<Row className="g-4 mb-5">
				<Col lg={8}>
					<Card className="border-0 shadow-sm h-100 p-3">
						<Card.Body>
							<h5 className="mb-4 fw-bold">Revenue & Bookings Trend</h5>
							<div style={{ width: "100%", height: 350 }}>
								<ResponsiveContainer>
									<AreaChart data={stats.monthlyData}>
										<defs>
											<linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#a57c00" stopOpacity={0.8} />
												<stop offset="95%" stopColor="#a57c00" stopOpacity={0} />
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
										<XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
										<YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
										<Tooltip
											contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
										/>
										<Area
											type="monotone"
											dataKey="revenue"
											name="Revenue"
											stroke="#a57c00"
											fillOpacity={1}
											fill="url(#colorRevenue)"
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col lg={4}>
					<Card className="border-0 shadow-sm h-100 p-3">
						<Card.Body className="text-center">
							<h5 className="mb-4 fw-bold text-start">Bookings by Room Category</h5>
							<div style={{ width: "100%", height: 350 }}>
								<ResponsiveContainer>
									<PieChart>
										<Pie
											data={stats.roomTypeData}
											innerRadius={60}
											outerRadius={80}
											paddingAngle={5}
											dataKey="value">
											{stats.roomTypeData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
										<Tooltip />
										<Legend verticalAlign="bottom" height={36} />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row className="g-4">
				<Col md={12}>
					<Card className="border-0 shadow-sm p-3">
						<Card.Body>
							<h5 className="mb-4 fw-bold">Monthly Bookings Analysis</h5>
							<div style={{ width: "100%", height: 300 }}>
								<ResponsiveContainer>
									<BarChart data={stats.monthlyData}>
										<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
										<XAxis dataKey="month" axisLine={false} tickLine={false} />
										<YAxis axisLine={false} tickLine={false} />
										<Tooltip />
										<Bar dataKey="count" name="Booking Quantity" fill="#8884d8" radius={[4, 4, 0, 0]} />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<style>{`
				.dashboard-card {
					transition: transform 0.3s ease, box-shadow 0.3s ease;
					border-radius: 12px;
				}
				.dashboard-card:hover {
					transform: translateY(-5px);
					box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
				}
				.icon-container {
					width: 50px;
					height: 50px;
					border-radius: 10px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.bg-primary-light { background-color: rgba(13, 110, 253, 0.1); }
				.bg-success-light { background-color: rgba(25, 135, 84, 0.1); }
				.bg-info-light { background-color: rgba(13, 202, 240, 0.1); }
				.bg-warning-light { background-color: rgba(255, 193, 7, 0.1); }
			`}</style>
		</Container>
	)
}

export default AdminDashboard
