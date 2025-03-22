import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { FaCalendarAlt, FaTicketAlt, FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllEvents } from "../api/eventApi";

import "../styles/global.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        if (!Array.isArray(data)) throw new Error("Invalid API response");
        setEvents(data);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegisterEvent = () => {
    if (user?.role?.toLowerCase() === "admin") {
      navigate("/registerevent");
    } else {
      setShowPopup(true);
      toast.error("Only admins can register events!");
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div className="home-container">
      {/* Cover Section */}
      <motion.section
  className="cover-section d-flex flex-column justify-content-center align-items-center text-center py-5"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1.2 }}
  style={{
    backgroundImage: `linear-gradient(to right, rgba(0, 95, 63, 0.85), rgba(1, 50, 32, 0.85)), url("https://res.cloudinary.com/dwzlaebxh/image/upload/v1742402225/event-images/nuk8ux4ougbrqsllg6id.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "#fff",
    minHeight: "70vh"
  }}
>
        <h1 className="display-4 fw-bold mb-3">Discover & Book Your Next Experience</h1>
        <p className="lead mb-4">Find amazing events, book tickets, and create unforgettable moments.</p>
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <Button variant="light" size="lg" onClick={() => navigate("/events")}>
            <FaCalendarAlt className="me-2" /> Explore Events
          </Button>
          <Button variant="outline-light" size="lg" onClick={handleRegisterEvent}>
            <FaPlusCircle className="me-2" /> Register Event
          </Button>
        </div>
        {showPopup && <Alert variant="danger" className="mt-3">Only admins can register events!</Alert>}
      </motion.section>

      {/* Trending Events */}
      <Container className="py-5">
        <h2 className="mb-4 text-center fw-semibold text-dark">🔥 Trending Events</h2>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading events...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : events.length === 0 ? (
          <p className="text-center text-muted">No events available.</p>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {events.map((event) => (
              <Col key={event._id}>
                <Card className="h-100 shadow-sm event-card border-0 rounded-4 overflow-hidden">
                  <div className="overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={event.image || "/default-event.jpg"}
                      alt={event.title}
                      className="img-fluid"
                      style={{ height: "200px", objectFit: "cover", transition: "transform 0.4s" }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title className="text-primary fw-bold">{event.title}</Card.Title>
                      <Card.Text className="text-muted small mb-2">
                        <FaCalendarAlt className="me-1" /> {new Date(event.date).toLocaleDateString()} <br />
                        <FaTicketAlt className="me-1" /> {event.venue}
                      </Card.Text>
                    </div>
                    <Button variant="outline-primary" className="mt-3 w-100" onClick={() => navigate(`/events/${event._id}`)}>
                      View Event
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default HomePage;
