import { useEffect, useState } from "react";
import { getUserTickets } from "../api/ticketApi";
import { Container, Table, Alert, Spinner, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Ensure user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if no token
      return;
    }

    getUserTickets()
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching tickets");
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Tickets</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {tickets.length === 0 ? (
        <Alert variant="info">No tickets booked yet.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Event</th>
              <th>Date</th>
              <th>Ticket Type</th>
              <th>Price</th>
              <th>Actions</th> {/* New column */}
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id}>
                <td>{index + 1}</td>
                <td>{ticket.event ? ticket.event.title : "Unknown Event"}</td>
                <td>
                  {ticket.event
                    ? new Date(ticket.event.date).toDateString()
                    : "No Date"}
                </td>
                <td>{ticket.ticketType || "Standard"}</td>
                <td>${ticket.price.toFixed(2)}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => navigate(`/ticket/${ticket._id}/qrcode`)}
                  >
                    View QR Code
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

export default MyTickets;
