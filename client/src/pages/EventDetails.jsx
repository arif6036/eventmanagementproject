import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../api/eventApi";
import { createReview, getReviewsByEvent } from "../api/reviewApi";
import { useSelector } from "react-redux";
import { Container, Card, Button, Alert, Form, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, MessageSquare } from "lucide-react";
import "../styles/global.css";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({ rating: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
        const reviewData = await getReviewsByEvent(id);
        setReviews(reviewData);
      } catch (err) {
        setError("Error fetching event details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleBooking = () => {
    navigate(user ? `/book/${id}` : "/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review.rating || !review.comment) {
      toast.error("Please fill in both rating and comment.");
      return;
    }

    setSubmitting(true);
    try {
      await createReview(event._id, review);
      toast.success("Review submitted!");
      setReview({ rating: "", comment: "" });
      const updated = await getReviewsByEvent(event._id);
      setReviews(updated);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-5">Loading event details...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      {/* Event Overview */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <Card className="p-4 shadow-lg mb-4">
          <Card.Img
            variant="top"
            src={event.image}
            alt={event.title}
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
          <Card.Body>
            <h2 className="fw-bold">{event.title}</h2>
            <p className="text-muted">{event.description}</p>
            <p><Calendar className="me-2" /> <strong>Date:</strong> {event.date}</p>
            <p><Clock className="me-2" /> <strong>Time:</strong> {event.time}</p>
            <p><MapPin className="me-2" /> <strong>Venue:</strong> {event.venue}</p>
            <p><strong>Type:</strong> <Badge bg={event.eventType === "paid" ? "success" : "secondary"}>{event.eventType}</Badge></p>
            <Button variant="primary" onClick={handleBooking} className="mt-3">
              {user ? "Book Ticket" : "Login to Book"}
            </Button>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Submit Review */}
      {user && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="p-4 shadow-sm mb-4">
            <h4 className="mb-3">💬 Leave a Review</h4>
            <Form onSubmit={handleReviewSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Rating (1-5)</Form.Label>
                <Form.Control
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  value={review.rating}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  name="comment"
                  rows={3}
                  value={review.comment}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </Form>
          </Card>
        </motion.div>
      )}

      {/* Review List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Card className="p-4 shadow-sm">
          <h4 className="mb-3"><MessageSquare className="me-2" /> Customer Reviews</h4>
          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet for this event.</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="border-bottom py-3">
                <strong>{r.user?.name}</strong> — ⭐ {r.rating}
                <p className="mb-0 text-muted">{r.comment}</p>
              </div>
            ))
          )}
        </Card>
      </motion.div>
    </Container>
  );
};

export default EventDetails;
