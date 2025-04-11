import { useEffect, useState } from "react";
import { getAllReviews, approveReview, deleteReview } from "../api/reviewApi";
import { Table, Container, Spinner, Alert, Button } from "react-bootstrap";
import { CheckCircle, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const AdminReviewPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (err) {
      setError("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveReview(id);
      toast.success("Review approved!");
      fetchReviews();
    } catch (err) {
      toast.error("Failed to approve review");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id);
      toast.success("Review deleted!");
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">📝 Review Management</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-3">Loading reviews...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Event</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r, index) => (
              <tr key={r._id}>
                <td>{index + 1}</td>
                <td>{r.user?.name || "Unknown"}</td>
                <td>{r.event?.title || "Unknown"}</td>
                <td>{r.rating}</td>
                <td>{r.comment}</td>
                <td>{r.approved ? "Approved" : "Pending"}</td>
                <td>
                  {!r.approved && (
                    <Button variant="success" size="sm" onClick={() => handleApprove(r._id)} className="me-2">
                      <CheckCircle size={16} />
                    </Button>
                  )}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(r._id)}>
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminReviewPanel;
