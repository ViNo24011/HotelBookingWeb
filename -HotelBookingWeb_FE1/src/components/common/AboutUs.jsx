import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUtensils, FaSpa, FaSwimmingPool, FaGlassMartiniAlt, FaHeart } from 'react-icons/fa';

const AboutUs = () => {
    return (
        <section className="about-us-page bg-light pb-5">
            {/* Hero Section */}
            <div className="about-hero position-relative mb-5 shadow-lg" style={{
                height: '65vh',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('/assets/images/about-hero.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center'
            }}>
                <div className="hero-content">
                    <h1 className="display-2 fw-bold hotel-color-gold mb-3 text-shadow-lg">LakeSide Hotel</h1>
                    <h3 className="fst-italic h4 text-white text-shadow">"A Symphony of Luxury and Peace"</h3>
                </div>
            </div>

            <Container>
                {/* Introduction */}
                <Row className="mb-5 justify-content-center text-center">
                    <Col lg={10}>
                        <p className="lead mb-4" style={{ fontSize: '1.25rem', color: '#555' }}>
                            "Where every detail is designed to celebrate your unique experience by the poetic lakeside."
                        </p>
                        <p>
                            Located in a prime location with views embracing the quiet beauty of nature, LakeSide Hotel is not just a stopover, but a destination marked by art and luxury. Separated from the hustle and bustle of the city, we open up a world-class resort space where the sophistication of contemporary architecture blends perfectly with the peaceful breath of the brilliant lake region.
                        </p>
                    </Col>
                </Row>

                {/* Section 1: Space */}
                <Row className="mb-5 align-items-center">
                    <Col md={6}>
                        <h2 className="hotel-color mb-4 border-bottom pb-2">Artistic Living Space</h2>
                        <p>
                            The rooms and suites at LakeSide Hotel are a testament to the meticulous design in every line. Each room is a perfect work of art with transparent glass doors opening to a panoramic view of the calm lake.
                        </p>
                        <p>
                            Equipped with high-end custom furniture, a modern <strong>Smart Room</strong> system controlled by a single touch, and breezy balconies filled with natural light – bringing a private privilege and absolute comfort to every guest.
                        </p>
                    </Col>
                    <Col md={6}>
                        <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800" alt="Luxury Room" className="img-fluid rounded-4 shadow" />
                    </Col>
                </Row>

                {/* Section 2: Amenities */}
                <div className="amenities-section py-5 mb-5 rounded-4" style={{ background: 'white', border: '1px solid #eee' }}>
                    <h2 className="text-center hotel-color mb-5">Top-notch Facility Experience</h2>
                    <Row className="g-4 px-4">
                        <Col md={6} lg={3}>
                            <div className="amenity-card text-center p-4 h-100 transition-hover">
                                <div className="icon-wrapper mb-3 text-gold">
                                    <FaUtensils size={40} />
                                </div>
                                <h4 className="h5 fw-bold">Elite Cuisine</h4>
                                <p className="small text-muted">Explore the world's culinary map at our high-end lakeside restaurants.</p>
                            </div>
                        </Col>
                        <Col md={6} lg={3}>
                            <div className="amenity-card text-center p-4 h-100 transition-hover">
                                <div className="icon-wrapper mb-3 text-gold">
                                    <FaSpa size={40} />
                                </div>
                                <h4 className="h5 fw-bold">Relaxation Oasis</h4>
                                <p className="small text-muted">Recharge your energy with Oasis Spa combining traditional medicine.</p>
                            </div>
                        </Col>
                        <Col md={6} lg={3}>
                            <div className="amenity-card text-center p-4 h-100 transition-hover">
                                <div className="icon-wrapper mb-3 text-gold">
                                    <FaSwimmingPool size={40} />
                                </div>
                                <h4 className="h5 fw-bold">Infinity Pool</h4>
                                <p className="small text-muted">The edge-to-edge design creates a feeling of being endlessly connected to the lake.</p>
                            </div>
                        </Col>
                        <Col md={6} lg={3}>
                            <div className="amenity-card text-center p-4 h-100 transition-hover">
                                <div className="icon-wrapper mb-3 text-gold">
                                    <FaGlassMartiniAlt size={40} />
                                </div>
                                <h4 className="h5 fw-bold">LakeView Lounge</h4>
                                <p className="small text-muted">An elite space with a fine wine cellar.</p>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Section 3: Philosophy */}
                <Row className="mb-5 align-items-center">
                    <Col md={6} className="order-md-2">
                        <h2 className="hotel-color mb-4 border-bottom pb-2">Service Philosophy from the Heart</h2>
                        <div className="d-flex mb-3">
                            <FaHeart className="text-danger me-3 mt-1" size={24} />
                            <div>
                                <p>At LakeSide Hotel, hospitality is not just a service, but an art. Our professional, dedicated, and understanding staff is always available 24/7 to personalize your every need.</p>
                            </div>
                        </div>
                        <p>
                            From breakfast served in bed to preparing small surprises for anniversaries. We believe that true luxury lies in the feeling of being understood and appreciated.
                        </p>
                    </Col>
                    <Col md={6} className="order-md-1">
                        <img src="https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=800" alt="Service" className="img-fluid rounded-4 shadow" />
                    </Col>
                </Row>

                {/* Conclusion */}
                <div className="text-center py-5 rounded-4 text-white shadow-lg position-relative overflow-hidden" style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url('/assets/images/footer-cta.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <h2 className="fw-light text-white mb-3">LakeSide Hotel</h2>
                    <p className="mb-4 opacity-75 lead">Come to feel the difference, and leave with unforgettable memories.</p>
                    <Link to="/browse-all-rooms" className="btn btn-hotel px-5 py-3 shadow-lg transition-hover text-decoration-none">
                        Book Now
                    </Link>
                </div>
            </Container>
        </section>
    );
};

export default AboutUs;
