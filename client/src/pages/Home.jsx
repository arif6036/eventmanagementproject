import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Container, Row, Col } from "react-bootstrap";

import { FaBullseye, FaRocket, FaRegLightbulb, FaPlusCircle, FaChevronRight, FaCalendarAlt } from "react-icons/fa";
import "../styles/global.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleRegisterEvent = () => {
    if (user?.role === "admin") {
      navigate("/registerevent");
    } else {
      alert("Only admins can register events.");
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="home-container text-light">
     
      <motion.section
        className="hero-section position-relative d-flex flex-column justify-content-center w-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 95, 63, 0.85) 0%, rgba(0, 30, 20, 0.95) 100%), url("https://res.cloudinary.com/dwzlaebxh/image/upload/v1742402225/event-images/nuk8ux4ougbrqsllg6id.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "92vh",
          paddingTop: "80px",
          paddingBottom: "80px",
          width: "100%"
        }}
      >
        <Container >
          <Row className="align-items-center">
            <Col lg={7} className="mb-5 mb-lg-0">
              <motion.div variants={staggerContainer} initial="initial" animate="animate">
                <motion.span 
                  variants={fadeInUp} 
                  className="badge bg-success bg-opacity-25 text-success mb-3 fs-6 fw-normal px-3 py-2 rounded-pill"
                >
                  Discover Amazing Events
                </motion.span>
                <motion.h1 
                  variants={fadeInUp}
                  className="display-3 fw-bold mb-4 lh-1"
                  style={{ 
                    background: "linear-gradient(90deg, #ffffff, #a8ffda)", 
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Empowering Events, Creating Lasting Connections
                </motion.h1>
                <motion.p variants={fadeInUp} className="lead mb-5 text-light opacity-75 fw-light">
                  Elevate your event experience with our powerful platform that connects communities and creates unforgettable moments.
                </motion.p>
                <motion.div variants={fadeInUp} className="d-flex flex-wrap gap-3">
                  <Button 
                    variant="success" 
                    size="lg" 
                    onClick={() => navigate("/events")}
                    className="px-4 py-3 fw-medium"
                    style={{ background: "linear-gradient(90deg, #00A870, #008C5E)" }}
                  >
                    Explore Events <FaChevronRight className="ms-2" size={14} />
                  </Button>
                  {user?.role === "admin" && (
                    <Button 
                      variant="outline-light" 
                      size="lg" 
                      onClick={handleRegisterEvent}
                      className="px-4 py-3 fw-medium"
                    >
                      <FaPlusCircle className="me-2" /> Register Event
                    </Button>
                  )}
                </motion.div>
              </motion.div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <motion.div 
                className="p-4 rounded-4 bg-dark bg-opacity-50 backdrop-blur"
                style={{ backdropFilter: "blur(10px)" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="d-flex align-items-center mb-4">
                  <div className="rounded-circle bg-success p-3 me-3">
                    <FaCalendarAlt size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0">Upcoming Featured Event</h5>
                    <p className="text-success mb-0">Next Week</p>
                  </div>
                </div>
                <h4>Upcoming Events 2025</h4>
                <p className="text-light opacity-75">Join industry leaders for a three-day immersive experience covering AI, blockchain, and sustainable tech.</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-success bg-opacity-25 text-success px-3 py-2">650+ Attending</span>
                  <Button variant="link" className="text-success p-0" onClick={() => navigate("/events")}>
                    View Details
                  </Button>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </motion.section>

      
      <div className="about-section w-100" style={{ backgroundColor: "#0a1914" }}>
        <Container className="py-6" style={{ marginTop: "80px", marginBottom: "80px" }}>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-success fw-medium">ABOUT US</span>
                <h2 className="display-5 fw-bold mb-4 mt-2">Transforming Event Experiences</h2>
                <p className="lead text-light opacity-75">
                  We're revolutionizing how events are created, discovered, and experienced—connecting people, ideas, 
                  and moments that matter through our innovative platform.
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      
      <div className="vision-mission-section w-100 py-6" style={{ background: "linear-gradient(180deg,rgb(20, 56, 44) 0%, #072E1F 100%)", width: "100%" }}>
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <motion.div
                className="h-100 p-5 rounded-4 position-relative overflow-hidden"
                style={{ 
                  background: "linear-gradient(135deg, rgba(0, 80, 53, 0.2) 0%, rgba(0, 40, 26, 0.6) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)"
                }}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="position-absolute rounded-circle" 
                  style={{ 
                    width: "120px", 
                    height: "120px", 
                    background: "radial-gradient(circle, rgba(0,168,112,0.3) 0%, rgba(0,0,0,0) 70%)",
                    top: "-20px",
                    right: "-20px",
                    zIndex: 0
                  }} 
                />
                <div className="position-relative z-1">
                  <div className="d-inline-block p-3 rounded-circle mb-4" style={{ background: "rgba(0, 168, 112, 0.2)" }}>
                    <FaRocket size={28} className="text-success" />
                  </div>
                  <h3 className="fw-bold mb-4">Our Vision</h3>
                  <p className="text-light opacity-75 mb-0">
                    To become the leading digital platform for event discovery and management across the
                    globe—making every event a success story and creating meaningful connections between people.
                  </p>
                </div>
              </motion.div>
            </Col>
            <Col md={6}>
              <motion.div
                className="h-100 p-5 rounded-4 position-relative overflow-hidden"
                style={{ 
                  background: "linear-gradient(135deg, rgba(0, 80, 53, 0.2) 0%, rgba(0, 40, 26, 0.6) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)"
                }}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="position-absolute rounded-circle" 
                  style={{ 
                    width: "120px", 
                    height: "120px", 
                    background: "radial-gradient(circle, rgba(0,168,112,0.3) 0%, rgba(0,0,0,0) 70%)",
                    bottom: "-20px",
                    left: "-20px",
                    zIndex: 0
                  }} 
                />
                <div className="position-relative z-1">
                  <div className="d-inline-block p-3 rounded-circle mb-4" style={{ background: "rgba(0, 168, 112, 0.2)" }}>
                    <FaBullseye size={28} className="text-success" />
                  </div>
                  <h3 className="fw-bold mb-4">Our Mission</h3>
                  <p className="text-light opacity-75 mb-0">
                    To empower event creators and participants with technology that makes planning,
                    booking, and enjoying events simple, seamless, and meaningful while fostering community engagement.
                  </p>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Success Stories - Modern Grid */}
      <div className="success-stories-section w-100" style={{ backgroundColor: "#0a1914", width: "100%" }}>
        <Container className="py-6" style={{ marginTop: "80px", marginBottom: "80px" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-5"
          >
            <span className="text-success fw-medium">SUCCESS STORIES</span>
            <h2 className="display-5 fw-bold mt-2 mb-4">Events That Made an Impact</h2>
            <p className="lead text-light opacity-75 mx-auto" style={{ maxWidth: "700px" }}>
              Discover how our platform has helped event organizers create meaningful experiences and build stronger communities.
            </p>

            
          </motion.div>

          <Row className="g-4">
  {[
    {
      title: "Tech Summit 2024",
      description: "Connected over 5,000 tech enthusiasts across 3 days with seamless registration, digital check-ins, and interactive sessions.",
      attendees: "5,000+"
    },
    {
      title: "Cultural Fest Gala",
      description: "Managed 20+ events across multiple venues with real-time updates, QR ticketing, and personalized attendee journeys.",
      attendees: "12,000+"
    },
    {
      title: "Startup Weekend",
      description: "Facilitated 100+ pitches, mentor connections, and networking opportunities for emerging entrepreneurs and investors.",
      attendees: "1,200+"
    }
  ].map((story, index) => (
    <Col lg={4} md={6} key={index}>
      <motion.div
        className="h-100 rounded-4 overflow-hidden position-relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ rotateY: 360 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        viewport={{ once: true }}
        style={{
          transformStyle: "preserve-3d"
        }}
      >
        <div
          className="p-5 h-100 d-flex flex-column"
          style={{
            background: "linear-gradient(135deg, rgba(10, 40, 30, 0.7) 0%, rgba(5, 25, 18, 0.9) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)"
          }}
        >
          <div className="d-inline-block p-3 rounded mb-4" style={{ background: "rgba(5, 122, 81, 0.2)" }}>
            <FaRegLightbulb size={22} className="text-warning" /> {story.title}
          </div>

          <p className="text-light opacity-75 mb-4">{story.description}</p>
          <div className="mt-auto">
            <span className="badge bg-success bg-opacity-25 text-success px-3 py-2">
              {story.attendees} Attendees
            </span>
          </div>
        </div>
      </motion.div>
    </Col>
  ))}
</Row>


          <div className="text-center mt-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button 
                variant="outline-success" 
                size="lg" 
                className="px-4 py-3"
                onClick={() => navigate("/case-studies")}
              >
                View All Case Studies <FaChevronRight className="ms-2" size={14} />
              </Button>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Call to Action */}
      <div className="cta-section w-100" style={{ background: "linear-gradient(135deg, #072E1F 0%, #0a1914 100%)", width: "100%" }}>
        <Container className="py-6" style={{ marginBottom: "80px" }}>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="display-5 fw-bold mb-4">Ready to Create Unforgettable Experiences?</h2>
                <p className="lead text-light opacity-75 mb-5">
                  Join thousands of event organizers who are transforming how people connect and celebrate.
                </p>
                <Button 
                  variant="success" 
                  size="lg" 
                  className="px-5 py-3 fw-medium"
                  onClick={() => navigate("/events")}
                  style={{ background: "linear-gradient(90deg, #00A870, #008C5E)" }}
                >
                  Get Started Today
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;