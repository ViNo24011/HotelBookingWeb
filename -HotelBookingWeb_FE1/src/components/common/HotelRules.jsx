import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
    FaIdCard, FaClock, FaBan, FaSmokingBan, FaDice, 
    FaLock, FaTools, FaUserFriends, FaWineGlassAlt, FaUserShield,
    FaCalendarTimes
} from 'react-icons/fa';

const HotelRules = () => {
    return (
        <section className="hotel-rules-page bg-light pb-5">
            {/* Header */}
            <div className="rules-header py-5 text-white text-center mb-5 shadow-lg" style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url('/assets/images/rules-hero.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Container>
                    <h1 className="display-4 fw-bold hotel-color-gold text-shadow-lg">Hotel Rules & Regulations</h1>
                    <p className="lead opacity-75">LakeSide Hotel – Committed to providing a safe and civilized vacation space</p>
                </Container>
            </div>

            <Container>
                <Row className="g-4">
                    {/* 1. Giấy tờ */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0 rounded-4 transition-hover">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-circle bg-primary-light text-primary me-3">
                                        <FaIdCard size={20} />
                                    </div>
                                    <h5 className="mb-0 fw-bold">1. Check-in Procedures</h5>
                                </div>
                                <p className="small text-muted">Please present your passport or ID card for check-in procedures at the Reception desk.</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 2. Thời gian */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0 rounded-4 transition-hover">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-circle bg-gold-light text-gold me-3">
                                        <FaClock size={20} />
                                    </div>
                                    <h5 className="mb-0 fw-bold">2. Standard Timing</h5>
                                </div>
                                <p className="small text-muted">Check-in: <strong>2:00 PM</strong> | Check-out: <strong>12:00 PM</strong>. Early check-in or late check-out will incur additional fees. Please notify the Reception in advance.</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 3. Đồ cấm */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0 rounded-4 transition-hover">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-circle bg-danger-light text-danger me-3">
                                        <FaBan size={20} />
                                    </div>
                                    <h5 className="mb-0 fw-bold">3. Prohibited Items & Cooking</h5>
                                </div>
                                <p className="small text-muted">Do not bring weapons, explosives, toxic substances, pets, or strong-smelling food into the room. No cooking or laundry in the room.</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 4. Thuốc lá */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0 rounded-4 transition-hover">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-circle bg-secondary-light text-secondary me-3">
                                        <FaSmokingBan size={20} />
                                    </div>
                                    <h5 className="mb-0 fw-bold">4. Smoking Policy</h5>
                                </div>
                                <p className="small text-muted">No smoking in rooms or restricted areas. Violators will be fined <strong>500,000 VNĐ</strong> per violation.</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 5. Tệ nạn */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0 rounded-4 transition-hover">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-circle bg-dark-light text-dark me-3">
                                        <FaDice size={20} />
                                    </div>
                                    <h5 className="mb-0 fw-bold">5. Prohibited Acts</h5>
                                </div>
                                <p className="small text-muted">All acts of gambling, prostitution, drug use, and controlled substances are strictly prohibited within the hotel premises.</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 6. Tài sản */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0 rounded-4 transition-hover">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-circle bg-warning-light text-warning me-3">
                                        <FaLock size={20} />
                                    </div>
                                    <h5 className="mb-0 fw-bold">6. Asset Protection</h5>
                                </div>
                                <p className="small text-muted">Please store valuables in the safety box. The hotel is only responsible for assets deposited at the Reception with a receipt.</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 7. CSVC */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0 rounded-4 transition-hover">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-circle bg-info-light text-info me-3">
                                        <FaTools size={20} />
                                    </div>
                                    <h5 className="mb-0 fw-bold">7. Facilities</h5>
                                </div>
                                <p className="small text-muted">Guests are responsible for preserving equipment. Any damage or breakage will be compensated according to the hotel's list price.</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 8. Tiếp khách */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0 rounded-4 transition-hover">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-circle bg-primary-light text-primary me-3">
                                        <FaUserFriends size={20} />
                                    </div>
                                    <h5 className="mb-0 fw-bold">8. Guest Visit Policy</h5>
                                </div>
                                <p className="small text-muted">No private guests are allowed in the room. If necessary, please register at the Reception and leave before <strong>9:00 PM</strong>.</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 9. Mini Bar */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0 rounded-4 transition-hover">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-circle bg-success-light text-success me-3">
                                        <FaWineGlassAlt size={20} />
                                    </div>
                                    <h5 className="mb-0 fw-bold">9. Mini Bar Services</h5>
                                </div>
                                <p className="small text-muted">Food and drinks in the mini bar will be paid for at the Reception according to the menu prices.</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 10. Trật tự */}
                    <Col md={12} lg={8}>
                        <Card className="h-100 shadow-sm border-0 rounded-4 transition-hover border-left-danger">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-circle bg-danger-light text-danger me-3">
                                        <FaUserShield size={20} />
                                    </div>
                                    <h5 className="mb-0 fw-bold">10. Stay Commitment & Public Order</h5>
                                </div>
                                <p className="small text-muted mb-0">
                                    Acts causing disorder (arguing, fighting, assault, or disrespecting staff) are strictly prohibited. The hotel reserves the right to terminate the stay immediately for violators without refunding the paid room rate.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Cancellation Policy (Kept from previous version) */}
                    <Col md={12} lg={4}>
                        <Card className="h-100 shadow-sm border-0 rounded-4 border-gold">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-circle bg-gold-light text-gold me-3">
                                        <FaCalendarTimes size={20} />
                                    </div>
                                    <h5 className="mb-0 fw-bold">Cancellation Policy</h5>
                                </div>
                                <ul className="list-unstyled small ps-2 mb-0">
                                    <li className="mb-1">• <strong>Before 5 days:</strong> 100% refund or rescheduling.</li>
                                    <li className="mb-1">• <strong>Before 3 days:</strong> 50% refund or rescheduling.</li>
                                    <li className="mb-1">• <strong>Less than 24h:</strong> No refund/cancellation support.</li>
                                    <li className="text-danger mt-2 fst-italic">• Holidays: Notify 7 days in advance for a 100% refund.</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <div className="mt-5 p-4 rounded-4 text-center glass shadow-sm border">
                    <p className="mb-0 text-muted fst-italic">
                        Registering at LakeSide Hotel means you have read and agreed to the above rules.
                    </p>
                </div>
            </Container>
        </section>
    );
};

export default HotelRules;
