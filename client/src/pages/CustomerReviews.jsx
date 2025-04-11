import { useEffect, useState } from "react";
import { getReviewsByEvent } from "../api/reviewApi";
import { useParams } from "react-router-dom";
import { Container, ListGroup, Spinner, Alert } from "react-bootstrap";

const CustomerReviews = () => {
  const { eventId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getReviewsByEvent(eventId)
      .then(setReviews)
      .catch(() => setError("Failed to load reviews"))
      .finally(() => setLoading(false));
  }, [eventId]);

  return (
    <Container className="mt-4">
      <h4>Customer Reviews</h4>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <ListGroup>
          {reviews.map((r) => (
            <ListGroup.Item key={r._id}>
              <strong>{r.user.name}</strong> ({r.rating} ★): {r.comment}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default CustomerReviews;
