import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEventById } from "../api/eventApi";
import { initiatePayment } from "../api/ticketApi";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { Calendar, Clock, MapPin, ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const BookTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      toast.error("Login required to book tickets.");
      navigate(`/login?redirect=/events/${id}/book`);
      return;
    }

    getEventById(id)
      .then((data) => {
        setEvent(data);
        setTotalPrice(data.ticketPrice || 0);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load event details.");
        setLoading(false);
      });
  }, [id, user, navigate]);

  useEffect(() => {
    if (event?.ticketPrice) {
      setTotalPrice(event.ticketPrice * quantity);
    }
  }, [quantity, event]);

  const handleConfirmBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication failed. Please login again.");
      navigate("/login");
      return;
    }

    const userId = user?._id || user?.id;

    try {
      setBookingInProgress(true);

      const response = await initiatePayment({
        eventId: id,
        amount: totalPrice,
        userId,
        quantity
      });
      console.log(" Payment Request Payload", {
        eventId: id,
        amount: totalPrice,
        userId,
        quantity,
      });

      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        toast.error("Failed to initiate payment.");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3 text-muted">Loading event details...</p>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">{error || "Event not found"}</Alert>
        <Button variant="outline-primary" as={Link} to="/events">
          <ArrowLeft className="me-2" size={16} /> Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="align-items-start">
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Img variant="top" src={event.image} alt={event.title} style={{ height: 300, objectFit: "cover" }} />
            <Card.Body>
              <Card.Title className="fw-bold">{event.title}</Card.Title>
              <p>{event.description}</p>
              <p><Calendar className="me-2" /> {event.date}</p>
              <p><Clock className="me-2" /> {event.time}</p>
              <p><MapPin className="me-2" /> {event.venue}</p>
              <p className="mb-0"><strong>Type:</strong> {event.eventType}</p>
              <p><strong>Price:</strong> ${event.ticketPrice}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm p-4 rounded-4 bg-light">
            <h4 className="mb-4">🎟️ Confirm Ticket</h4>

            <div className="mb-3">
              <label className="form-label fw-semibold">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className="mb-4 p-3 border bg-white rounded">
              <h5>Total: <span className="text-success">${totalPrice}</span></h5>
            </div>

            <Button
              variant="success"
              className="w-100 mb-2"
              onClick={handleConfirmBooking}
              disabled={bookingInProgress}
            >
              {bookingInProgress ? (
                <Spinner size="sm" animation="border" className="me-2" />
              ) : (
                <CreditCard className="me-2" size={18} />
              )}
              {bookingInProgress ? "Processing..." : "Proceed to Payment"}
            </Button>

            <Button
              variant="outline-secondary"
              className="w-100"
              as={Link}
              to="/events"
            >
              <ArrowLeft className="me-2" size={18} /> Cancel and Go Back
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookTicket;
