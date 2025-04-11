import { useEffect, useState } from "react";
import { getAllEvents } from "../api/eventApi";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Calendar, MapPin, Clock, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllEvents()
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  return (
    <div style={{ backgroundColor: "#0f1f17", minHeight: "100vh", color: "#f1f1f1" }}>
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="d-flex justify-content-between align-items-center mb-4"
        >
          <h2 className="fw-bold text-success">🌟 Upcoming Events</h2>
          {user?.role === "admin" && (
            <Button variant="outline-light" onClick={handleCreateEvent}>
              <PlusCircle size={18} className="me-2" /> Add Event
            </Button>
          )}
        </motion.div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="light" />
            <p className="mt-3 text-muted">Loading events...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : events.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p>No upcoming events found.</p>
            {user?.role === "admin" && (
              <Button variant="outline-success" onClick={handleCreateEvent}>
                Create an Event
              </Button>
            )}
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {events.map((event, index) => (
              <Col key={event._id}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-100 shadow border-0 bg-dark text-white rounded-4">
                    {event.image && (
                      <motion.img
                        src={event.image}
                        alt={event.title}
                        style={{ height: "180px", objectFit: "cover" }}
                        className="card-img-top"
                        whileHover={{ scale: 1.03 }}
                      />
                    )}
                    <Card.Body>
                      <Badge bg="success" className="mb-2">{event.category || "General"}</Badge>
                      <Card.Title className="fw-bold">{event.title}</Card.Title>
                      <div className="small text-light">
                        <div className="mb-1 d-flex align-items-center">
                          <Calendar size={16} className="me-2" />
                          {formatDate(event.date)}
                        </div>
                        <div className="mb-1 d-flex align-items-center">
                          <Clock size={16} className="me-2" />
                          {getTime(event.date)}
                        </div>
                        <div className="mb-1 d-flex align-items-center">
                          <MapPin size={16} className="me-2" />
                          {event.venue}
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-transparent border-0">
                      <Button
                        as={Link}
                        to={`/events/${event._id}`}
                        variant="outline-light"
                        size="sm"
                        className="w-100 fw-semibold"
                      >
                        View Details
                      </Button>
                    </Card.Footer>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Events;
