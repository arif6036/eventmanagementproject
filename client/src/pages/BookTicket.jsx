import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEventById } from "../api/eventApi";
import { initiatePayment, confirmBooking } from "../api/ticketApi";
import { Container, Card, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Calendar, Clock, MapPin, ArrowLeft, CreditCard } from "lucide-react";

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
      toast.error("You must be logged in to book tickets.");
      navigate(`/login?redirect=/events/${id}/book`);
      return;
    }

    setLoading(true);
    getEventById(id)
      .then((data) => {
        setEvent(data);
        setTotalPrice(data.ticketPrice || 0);
      })
      .catch(() => setError("Error fetching event details"))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  useEffect(() => {
    if (event && event.ticketPrice) {
      setTotalPrice(event.ticketPrice * quantity);
    }
  }, [quantity, event]);

  const handleBooking = async (e) => {
    e.preventDefault();

    const userId = user?._id || user?.id;
    if (!userId) {
      toast.error("User ID is missing. Please re-login.");
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication error. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setBookingInProgress(true);

      // ✅ Free ticket booking
      if (totalPrice === 0) {
        const ticketData = { ticketType: "Free", price: 0, userId, quantity };
        const bookingResponse = await confirmBooking(id, ticketData, token);
        if (!bookingResponse) throw new Error("Booking confirmation failed.");

        toast.success("Free ticket booked successfully!");
        navigate("/my-tickets");
        return;
      }

      // ✅ Paid ticket - initiate Stripe payment
      const paymentResponse = await initiatePayment({
        eventId: id,
        amount: totalPrice,
        userId,
        quantity,
      });

      if (paymentResponse?.paymentUrl) {
        window.location.href = paymentResponse.paymentUrl;
      } else {
        throw new Error("Failed to initiate payment.");
      }

    } catch (error) {
      const message = error.response?.data?.message || error.message || "Booking failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || "Event not found"}</Alert>
        <Button variant="outline-primary" as={Link} to="/events" className="mt-3">
          <ArrowLeft size={16} className="me-2" /> Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-lg border-0 rounded-4 p-4">
            <Row className="g-4">
              {/* Event Details */}
              <Col md={7}>
                <h2 className="fw-bold text-primary mb-3">{event.title}</h2>
                <p><Calendar className="me-2 text-success" /> {event.date}</p>
                <p><Clock className="me-2 text-warning" /> {event.time}</p>
                <p><MapPin className="me-2 text-danger" /> {event.venue}</p>
                <p className="text-muted mt-4">
                  {event.description || "Secure your seat before it’s gone!"}
                </p>
              </Col>

              {/* Booking Form */}
              <Col md={5} className="bg-light p-4 rounded">
                <h5 className="text-center mb-4 fw-semibold">🎟️ Book Your Tickets</h5>

                <Form onSubmit={handleBooking}>
                  <Form.Group className="mb-3">
                    <Form.Label>Number of Tickets</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="shadow-sm"
                    />
                  </Form.Group>

                  <div className="mb-4 p-3 bg-white rounded shadow-sm border">
                    <h5 className="mb-0">Total: <span className="text-success fw-bold">${totalPrice}</span></h5>
                    <small className="text-muted">Includes standard admission</small>
                  </div>

                  <Button
                    type="submit"
                    variant="success"
                    className="w-100 fw-bold"
                    disabled={bookingInProgress}
                  >
                    {bookingInProgress ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="me-2" size={18} />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookTicket;
