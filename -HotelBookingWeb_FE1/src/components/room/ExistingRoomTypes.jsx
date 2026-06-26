import React, { useEffect, useState } from "react"
import { getAllRoomTypes, deleteRoomType, updateRoomType, addRoomType, getAllServices } from "../utils/ApiFunctions"
import { Col, Row, Table, Button, Modal, Form, Container } from "react-bootstrap"
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa"

const ExistingRoomTypes = () => {
	const [roomTypes, setRoomTypes] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")

	// State for Modal (Add/Edit)
	const [showModal, setShowModal] = useState(false)
	const [isEditMode, setIsEditMode] = useState(false)
	const [currentType, setCurrentType] = useState({
		id: null,
		name: "",
		basePrice: "",
		maxCapacity: "",
		description: "",
		photo: null,
		serviceIds: []
	})
	const [imagePreview, setImagePreview] = useState("")
	const [allServices, setAllServices] = useState([])

	useEffect(() => {
		fetchRoomTypes()
		fetchServices()
	}, [])

	const fetchServices = async () => {
		try {
			const services = await getAllServices()
			setAllServices(services)
		} catch (error) {
			console.error("Error fetching services:", error.message)
		}
	}

	const fetchRoomTypes = async () => {
		setIsLoading(true)
		try {
			const result = await getAllRoomTypes()
			setRoomTypes(result)
			setIsLoading(false)
		} catch (error) {
			setErrorMessage(error.message)
			setIsLoading(false)
		}
	}

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this room type? All rooms belonging to this type will also be affected.")) {
			try {
				await deleteRoomType(id)
				setSuccessMessage("Room type deleted successfully!")
				fetchRoomTypes()
			} catch (error) {
				setErrorMessage(error.message)
			}
			setTimeout(() => {
				setSuccessMessage("")
				setErrorMessage("")
			}, 3000)
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setCurrentType({ ...currentType, [name]: value })
	}

	const handleImageChange = (e) => {
		const selectedImage = e.target.files[0]
		setCurrentType({ ...currentType, photo: selectedImage })
		setImagePreview(URL.createObjectURL(selectedImage))
	}

	const handleServiceChange = (serviceId) => {
		const updatedServiceIds = currentType.serviceIds.includes(serviceId)
			? currentType.serviceIds.filter((id) => id !== serviceId)
			: [...currentType.serviceIds, serviceId]
		setCurrentType({ ...currentType, serviceIds: updatedServiceIds })
	}

	const handleOpenModal = (type = null) => {
		if (type) {
			setIsEditMode(true)
			setCurrentType({
				id: type.id,
				name: type.name,
				basePrice: type.basePrice,
				maxCapacity: type.maxCapacity,
				description: type.description,
				photo: null,
				serviceIds: type.freeServices ? type.freeServices.map((s) => s.id) : []
			})
			setImagePreview(type.photo ? `data:image/png;base64,${type.photo}` : "")
		} else {
			setIsEditMode(false)
			setCurrentType({
				id: null,
				name: "",
				basePrice: "",
				maxCapacity: "",
				description: "",
				photo: null,
				serviceIds: []
			})
			setImagePreview("")
		}
		setShowModal(true)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			if (isEditMode) {
				await updateRoomType(currentType.id, currentType)
				setSuccessMessage("Room type updated successfully!")
			} else {
				await addRoomType(currentType)
				setSuccessMessage("New room type added successfully!")
			}
			setShowModal(false)
			fetchRoomTypes()
		} catch (error) {
			setErrorMessage(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setErrorMessage("")
		}, 3000)
	}

	return (
		<Container className="mt-5 mb-5">
			{successMessage && <div className="alert alert-success">{successMessage}</div>}
			{errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

			<Row className="mb-3">
				<Col md={6}>
					<h2>Manage Room Categories</h2>
				</Col>
				<Col md={6} className="d-flex justify-content-end">
					<Button variant="hotel" onClick={() => handleOpenModal()}>
						<FaPlus /> Add New Room Type
					</Button>
				</Col>
			</Row>

			{isLoading ? (
				<p>Loading data...</p>
			) : (
				<Table striped bordered hover responsive>
					<thead>
						<tr className="text-center">
							<th>ID</th>
							<th>Photo</th>
							<th>Room Type Name</th>
							<th>Price (Night)</th>
							<th>Max Capacity</th>
							<th>Free Services</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{roomTypes.map((type) => (
							<tr key={type.id} className="text-center align-middle">
								<td>{type.id}</td>
								<td>
									{type.photo ? (
										<img
											src={`data:image/png;base64,${type.photo}`}
											alt={type.name}
											style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
										/>
									) : (
										"No Image"
									)}
								</td>
								<td>{type.name}</td>
								<td>{type.basePrice ? type.basePrice.toLocaleString() : "0"} VNĐ</td>
								<td>{type.maxCapacity} persons</td>
								<td>
									{type.freeServices && type.freeServices.length > 0 ? (
										<ul className="list-unstyled mb-0 text-start small">
											{type.freeServices.map((service) => (
												<li key={service.id} className="text-success">
													• {service.name}
												</li>
											))}
										</ul>
									) : (
										<span className="text-muted small">No free services</span>
									)}
								</td>
								<td>
									<div className="d-flex justify-content-center gap-2">
										<Button variant="warning" size="sm" onClick={() => handleOpenModal(type)}>
											<FaEdit />
										</Button>
										<Button variant="danger" size="sm" onClick={() => handleDelete(type.id)}>
											<FaTrashAlt />
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}

			<Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>{isEditMode ? "Update Room Type" : "Add New Room Type"}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit}>
						<Row>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Room Type Name</Form.Label>
									<Form.Control
										type="text"
										name="name"
										value={currentType.name}
										onChange={handleInputChange}
										required
										placeholder="e.g.: VIP Room, Deluxe..."
									/>
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Price per night (VNĐ)</Form.Label>
									<Form.Control
										type="number"
										name="basePrice"
										value={currentType.basePrice}
										onChange={handleInputChange}
										required
									/>
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Max Capacity</Form.Label>
									<Form.Control
										type="number"
										name="maxCapacity"
										value={currentType.maxCapacity}
										onChange={handleInputChange}
										required
									/>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Room Type Photo</Form.Label>
									<Form.Control type="file" onChange={handleImageChange} />
									{imagePreview && (
										<div className="mt-2 text-center">
											<img
												src={imagePreview}
												alt="Preview"
												className="img-fluid rounded shadow-sm"
												style={{ maxHeight: "150px" }}
											/>
										</div>
									)}
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Description</Form.Label>
									<Form.Control
										as="textarea"
										rows={3}
										name="description"
										value={currentType.description}
										onChange={handleInputChange}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row className="mt-3">
							<Col md={12}>
								<Form.Label className="fw-bold">Free Services Integration</Form.Label>
								<div className="d-flex flex-wrap gap-3 p-3 border rounded bg-light">
									{allServices.length > 0 ? (
										allServices.map((service) => (
											<Form.Check
												key={service.id}
												type="checkbox"
												id={`service-${service.id}`}
												label={service.name}
												checked={currentType.serviceIds.includes(service.id)}
												onChange={() => handleServiceChange(service.id)}
												className="mb-0"
											/>
										))
									) : (
										<p className="text-muted mb-0 small">No services available. Please add services first.</p>
									)}
								</div>
							</Col>
						</Row>
						<div className="d-flex justify-content-end gap-2 mt-4">
							<Button variant="secondary" onClick={() => setShowModal(false)}>
								Cancel
							</Button>
							<Button variant="hotel" type="submit">
								{isEditMode ? "Save Changes" : "Create New"}
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</Container>
	)
}

export default ExistingRoomTypes
