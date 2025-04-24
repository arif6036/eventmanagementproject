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
  Badge,
  Nav
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  Clock,
  PlusCircle,
  Star,
  CheckCircle,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
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

  // Filter events based on date
  const currentDate = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= currentDate);
  const completedEvents = events.filter(event => new Date(event.date) < currentDate);

  // Card variants for smooth animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div style={{ backgroundColor: "#0f1f17", minHeight: "100vh", color: "#f1f1f1" }}>
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="d-flex flex-wrap justify-content-between align-items-center mb-4"
        >
         
          {user?.role === "admin" && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline-success" onClick={handleRegisterEvent}>
                <PlusCircle size={18} className="me-2" /> Add Event
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5"
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-light"> Customer Reviews</h4>
            <Link to="/reviews" className="text-decoration-none text-success">
              View all
            </Link>
          </div>

          {reviews.length > 0 ? (
            <div className="review-carousel position-relative">
              <Row className="g-3">
                {reviews.slice(0, 4).map((review, index) => (
                  <Col key={review._id} md={6} lg={3}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card className="bg-dark text-light shadow h-100 border-0">
                        <Card.Body>
                          <div className="d-flex align-items-center mb-2">
                            <div className="bg-success bg-opacity-25 rounded-circle p-2 me-2">
                              <Star className="text-warning" size={16} />
                            </div>
                            <strong>{review.user?.name || "Anonymous"}</strong>
                          </div>
                          <p className="mb-1 small"><strong>Event:</strong> {review.event?.title || "N/A"}</p>
                          <div className="mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                fill={i < review.rating ? "#ffc107" : "none"} 
                                color={i < review.rating ? "#ffc107" : "#6c757d"} 
                                className="me-1" 
                              />
                            ))}
                          </div>
                          <p className="text-muted small mb-0">{review.comment}</p>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <Card className="bg-dark text-light border-0">
              <Card.Body className="text-center py-4">
                <p className="mb-0">No reviews available yet.</p>
              </Card.Body>
            </Card>
          )}
        </motion.div>

        {/* Event Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4"
        >
          <Nav variant="tabs" className="border-bottom border-success">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === "upcoming"}
                onClick={() => setActiveTab("upcoming")}
                className={`border-0 ${activeTab === "upcoming" ? "bg-success text-white" : "text-light"}`}
              >
                <CalendarIcon size={16} className="me-2" />
                Upcoming Events ({upcomingEvents.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === "completed"}
                onClick={() => setActiveTab("completed")}
                className={`border-0 ${activeTab === "completed" ? "bg-success text-white" : "text-light"}`}
              >
                <CheckCircle size={16} className="me-2" />
                Completed Events ({completedEvents.length})
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </motion.div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-3 text-muted">Loading events...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "upcoming" ? (
                upcomingEvents.length === 0 ? (
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
                    {upcomingEvents.map((event, index) => (
                      <Col key={event._id}>
                        <motion.div
                          custom={index}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        >
                          <Card className="h-100 shadow border-0 bg-dark text-white rounded-4 overflow-hidden">
                            {event.image && (
                              <div className="overflow-hidden">
                                <motion.img
                                  src={event.image}
                                  alt={event.title}
                                  loading="lazy"
                                  style={{ height: "180px", objectFit: "cover", width: "100%" }}
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                            )}
                            <Card.Body>
                              <Badge bg="success" className="mb-2">{event.category || "General"}</Badge>
                              <Card.Title className="fw-bold">{event.title}</Card.Title>
                              <div className="small text-light mt-3">
                                <div className="mb-2 d-flex align-items-center">
                                  <Calendar size={16} className="me-2 text-success" />
                                  {formatDate(event.date)}
                                </div>
                                <div className="mb-2 d-flex align-items-center">
                                  <Clock size={16} className="me-2 text-success" />
                                  {getTime(event.date)}
                                </div>
                                <div className="mb-2 d-flex align-items-center">
                                  <MapPin size={16} className="me-2 text-success" />
                                  {event.venue}
                                </div>
                              </div>
                            </Card.Body>
                            <Card.Footer className="bg-transparent border-0">
                              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                  as={Link}
                                  to={`/events/${event._id}`}
                                  variant="outline-success"
                                  size="sm"
                                  className="w-100 fw-semibold"
                                >
                                  View Details
                                </Button>
                              </motion.div>
                            </Card.Footer>
                          </Card>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                )
              ) : (
                completedEvents.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <p>No completed events found.</p>
                  </div>
                ) : (
                  <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {completedEvents.map((event, index) => (
                      <Col key={event._id}>
                        <motion.div
                          custom={index}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        >
                          <Card className="h-100 shadow border-0 bg-dark text-white rounded-4 overflow-hidden position-relative">
                            <div className="position-absolute top-0 end-0 m-2 z-1">
                              <Badge bg="secondary" className="opacity-75">Completed</Badge>
                            </div>
                            {event.image && (
                              <div className="overflow-hidden position-relative">
                                <motion.img
                                  src={event.image}
                                  alt={event.title}
                                  loading="lazy"
                                  style={{ 
                                    height: "180px", 
                                    objectFit: "cover", 
                                    width: "100%",
                                    filter: "grayscale(40%)"
                                  }}
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                />
                                <div className="position-absolute top-0 left-0 w-100 h-100 bg-dark bg-opacity-25"></div>
                              </div>
                            )}
                            <Card.Body>
                              <Badge bg="secondary" className="mb-2">{event.category || "General"}</Badge>
                              <Card.Title className="fw-bold">{event.title}</Card.Title>
                              <div className="small text-light mt-3">
                                <div className="mb-2 d-flex align-items-center">
                                  <Calendar size={16} className="me-2" />
                                  {formatDate(event.date)}
                                </div>
                                <div className="mb-2 d-flex align-items-center">
                                  <Clock size={16} className="me-2" />
                                  {getTime(event.date)}
                                </div>
                                <div className="mb-2 d-flex align-items-center">
                                  <MapPin size={16} className="me-2" />
                                  {event.venue}
                                </div>
                              </div>
                            </Card.Body>
                            <Card.Footer className="bg-transparent border-0">
                              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                  as={Link}
                                  to={`/events/${event._id}`}
                                  variant="outline-secondary"
                                  size="sm"
                                  className="w-100 fw-semibold"
                                >
                                  View Details
                                </Button>
                              </motion.div>
                            </Card.Footer>
                          </Card>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                )
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </Container>
    </div>
  );
};

export default Events;