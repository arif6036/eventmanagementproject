import { useEffect, useState } from "react";
import { getAllEvents } from "../api/eventApi";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Calendar, MapPin, Clock, PlusCircle } from "lucide-react";

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

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading events...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger">{error}</div>
        <Button variant="outline-primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="bg-light py-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark">🌟 Upcoming Events</h2>
          {user?.role === "admin" && (
            <Button variant="success" onClick={handleCreateEvent}>
              <PlusCircle size={18} className="me-2" /> Add Event
            </Button>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No upcoming events found.</p>
            {user?.role === "admin" && (
              <Button variant="outline-primary" onClick={handleCreateEvent}>
                Create an Event
              </Button>
            )}
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {events.map(event => (
              <Col key={event._id}>
                <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-shadow">
                  {event.image && (
                    <Card.Img
                      variant="top"
                      src={event.image}
                      alt={event.title}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  )}
                  <Card.Body>
                    <Badge bg="info" className="mb-2">{event.category || "General"}</Badge>
                    <Card.Title className="fw-bold text-dark">{event.title}</Card.Title>
                    <div className="text-muted small">
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
                  <Card.Footer className="bg-white border-0">
                    <Button
                      as={Link}
                      to={`/events/${event._id}`}
                      variant="outline-primary"
                      size="sm"
                      className="w-100 fw-semibold"
                    >
                      View Details
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </Container>
  );
};

export default Events;
