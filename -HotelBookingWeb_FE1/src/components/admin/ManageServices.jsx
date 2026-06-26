import React, { useState, useEffect } from "react"
import { Container, Row, Col, Table, Button, Form, Modal } from "react-bootstrap"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import { getAllServices, addService, updateService, deleteService } from "../utils/ApiFunctions"

const ManageServices = () => {
    const [services, setServices] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [editingId, setEditingId] = useState(null)
    
    const [serviceData, setServiceData] = useState({
        name: "",
        description: "",
        price: "",
        unit: "",
        isActive: true
    })

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        setIsLoading(true)
        try {
            const result = await getAllServices()
            setServices(result)
            setErrorMessage("")
        } catch (error) {
            setErrorMessage(error.message)
        }
        setIsLoading(false)
    }

    const handleShow = (service = null) => {
        if (service) {
            setEditingId(service.id)
            setServiceData({
                name: service.name,
                description: service.description || "",
                price: service.price,
                unit: service.unit || "",
                isActive: service.active
            })
        } else {
            setEditingId(null)
            setServiceData({ name: "", description: "", price: "", unit: "", isActive: true })
        }
        setShowModal(true)
    }

    const handleClose = () => {
        setShowModal(false)
        setErrorMessage("")
        setSuccessMessage("")
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setServiceData({
            ...serviceData,
            [name]: type === "checkbox" ? checked : value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingId) {
                await updateService(editingId, serviceData)
                setSuccessMessage("Service updated successfully!")
            } else {
                await addService(serviceData)
                setSuccessMessage("New service added successfully!")
            }
            fetchServices()
            setTimeout(() => handleClose(), 1500)
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await deleteService(id)
                setSuccessMessage("Service deleted successfully!")
                fetchServices()
            } catch (error) {
                setErrorMessage(error.message)
            }
        }
    }

    return (
        <Container className="my-5 py-5">
            <Row>
                <Col className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Manage Hotel Services</h2>
                    <Button variant="primary" onClick={() => handleShow()}>
                        <FaPlus className="me-2" /> Add New Service
                    </Button>
                </Col>
            </Row>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {isLoading ? (
                <p>Loading services...</p>
            ) : (
                <Table striped bordered hover responsive className="shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Unit</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">No services found</td>
                            </tr>
                        ) : (
                            services.map((service, index) => (
                                <tr key={service.id}>
                                    <td>{index + 1}</td>
                                    <td>{service.name}</td>
                                    <td>{service.description}</td>
                                    <td>{service.price.toLocaleString()} VNĐ</td>
                                    <td>{service.unit}</td>
                                    <td>
                                        <span className={`badge ${service.active ? 'bg-success' : 'bg-danger'}`}>
                                            {service.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(service)}>
                                            <FaEdit />
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(service.id)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? "Edit Service" : "Add New Service"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Service Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="name" 
                                value={serviceData.name} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                name="description" 
                                value={serviceData.description} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price (VNĐ)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="price" 
                                        value={serviceData.price} 
                                        onChange={handleInputChange} 
                                        required 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Unit (e.g. /person, /day)</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="unit" 
                                        value={serviceData.unit} 
                                        onChange={handleInputChange} 
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {editingId && (
                            <Form.Group className="mb-3">
                                <Form.Check 
                                    type="checkbox" 
                                    label="Is Active?" 
                                    name="isActive" 
                                    checked={serviceData.isActive} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>
                        )}
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={handleClose}>Cancel</Button>
                            <Button variant="primary" type="submit">Save Changes</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default ManageServices
