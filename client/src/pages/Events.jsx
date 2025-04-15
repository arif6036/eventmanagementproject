import { useEffect, useState } from "react";
import { getAllEvents } from "../api/eventApi";
import { getAllReviews } from "../api/reviewApi";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  Clock,
  PlusCircle,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [eventData, reviewData] = await Promise.all([
          getAllEvents(),
          getAllReviews()
        ]);
        setEvents(eventData || []);
        setReviews((reviewData || []).filter(r => r.approved));
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load events or reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      weekday: "short", year: "numeric", month: "short", day: "numeric"
    });

  const getTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleRegisterEvent = () => {
    if (user?.role === "admin") {
      navigate("/registerevent");
    } else {
      toast.error("Only admins can register events!");
    }
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
            <Button variant="outline-light" onClick={handleRegisterEvent}>
              <PlusCircle size={18} className="me-2" /> Add Event
            </Button>
          )}
        </motion.div>

        {/* ✅ Approved Reviews */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5"
          >
            <h4 className="text-light mb-3">⭐ Customer Reviews</h4>
            <Row className="g-3">
              {reviews.slice(0, 4).map((review) => (
                <Col key={review._id} md={6} lg={3}>
                  <Card className="bg-dark text-light shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <Star className="text-warning me-2" />
                        <strong>{review.user?.name || "Anonymous"}</strong>
                      </div>
                      <p className="mb-1 small"><strong>Event:</strong> {review.event?.title || "N/A"}</p>
                      <p className="mb-1">⭐ {review.rating} / 5</p>
                      <p className="text-muted small mb-0">{review.comment}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </motion.div>
        )}

        {/* ✅ Events List */}
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
              <Button variant="outline-success" onClick={handleRegisterEvent}>
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
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="h-100 shadow border-0 bg-dark text-white rounded-4">
                    {event.image && (
                      <motion.img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
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
