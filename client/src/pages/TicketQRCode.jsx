import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { generateTicket, checkInTicket } from "../api/ticketApi";
import { Container, Card, Alert, Spinner, Button, Image } from "react-bootstrap";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

const TicketQRCode = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please login again.");
        navigate("/login");
        return;
      }

      try {
        const data = await generateTicket(ticketId, token);
        setTicket(data.ticket);
        setQrCode(data.qrCode);
      } catch (err) {
        setError("Failed to generate QR code");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, navigate]);

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem("token");
      await checkInTicket(ticketId, token);
      setTicket((prev) => ({ ...prev, isCheckedIn: true }));
      toast.success("Check-in successful!");
    } catch (error) {
      setError("Check-in failed. Try again.");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Link to="/admin/tickets" className="btn btn-link">
        <ArrowLeft size={18} className="me-1" /> Back to Tickets
      </Link>

      {error && <Alert variant="danger">{error}</Alert>}

      {ticket ? (
        <Card className="text-center mt-4 shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h4>Ticket QR Code</h4>
          </Card.Header>
          <Card.Body>
            <h5>{ticket.event?.title || "Event"}</h5>
            <p>Date: {new Date(ticket.event?.date).toDateString()}</p>
            <p>Venue: {ticket.event?.venue}</p>
            <p>Type: {ticket.ticketType}</p>
            <p>Price: ${ticket.price}</p>

            {qrCode ? (
              <Image src={qrCode} alt="Ticket QR Code" fluid className="mb-3" />
            ) : (
              <Alert variant="warning">QR Code not available</Alert>
            )}

            {ticket.isCheckedIn ? (
              <Alert variant="success">
                <CheckCircle size={18} className="me-2" />
                Ticket Checked In
              </Alert>
            ) : (
              <Button variant="success" onClick={handleCheckIn}>
                <CheckCircle size={18} className="me-2" />
                Check-In Ticket
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="warning">Ticket not found</Alert>
      )}
    </Container>
  );
};

export default TicketQRCode;
