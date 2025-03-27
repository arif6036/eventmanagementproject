import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { generateTicket, checkInTicket } from "../api/ticketApi";
import { downloadTicketPDF } from "../utils/pdfGenerator";

import {
  Container,
  Card,
  Alert,
  Spinner,
  Button,
  Image,
  Row,
  Col,
} from "react-bootstrap";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TicketQRCode = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const qrRef = useRef();

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

  const handleDownload = async () => {
    const element = qrRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("ticket.pdf");
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="mb-3">
        <Link to="/admin/tickets" className="btn btn-outline-secondary btn-sm">
          <ArrowLeft size={18} className="me-1" /> Back to Tickets
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {ticket ? (
        <div ref={qrRef} className="p-3">
          <Card className="shadow-lg border-0 rounded-4 ticket-card mx-auto">
            <Card.Header className="bg-success text-white text-center rounded-top-4 py-3">
              <h4 className="mb-0 fw-semibold">Event Ticket</h4>
            </Card.Header>

            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col xs={12} md={6} className="text-md-start text-center mb-4 mb-md-0">
                  <h5 className="fw-bold">{ticket.event?.title || "Event"}</h5>
                  <p className="mb-1">📅 Date: {new Date(ticket.event?.date).toDateString()}</p>
                  <p className="mb-1">📍 Venue: {ticket.event?.venue}</p>
                  <p className="mb-1">🎟 Type: {ticket.ticketType}</p>
                  <p className="mb-3">💰 Price: ${ticket.price}</p>

                  {ticket.isCheckedIn ? (
                    <Alert variant="success" className="d-inline-flex align-items-center">
                      <CheckCircle size={18} className="me-2" />
                      Checked In
                    </Alert>
                  ) : (
                    <Button variant="success" onClick={handleCheckIn}>
                      <CheckCircle size={18} className="me-2" />
                      Check-In Ticket
                    </Button>
                  )}
                </Col>

                <Col xs={12} md={6} className="text-center">
                  {qrCode ? (
                    <>
                      <Image
                        src={qrCode}
                        alt="Ticket QR Code"
                        fluid
                        className="qr-image p-2 border rounded-3 bg-light"
                        style={{ maxWidth: "250px" }}
                      />
                      <p className="mt-2 text-muted small">Scan at entry</p>
                    </>
                  ) : (
                    <Alert variant="warning">QR Code not available</Alert>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <Alert variant="warning">Ticket not found</Alert>
      )}

      {ticket && (
        <div className="text-center">
          {/* <Button onClick={handleDownload} variant="outline-primary" className="mt-3">
            📥 Download Ticket as PDF
          </Button> */}
          <Button
    variant="outline-success"
    className="mt-3"
    onClick={() => downloadTicketPDF(ticket, qrCode)}
  >
    📥 Download PDF Ticket
  </Button>
        </div>
      )}
    </Container>
  );
};

export default TicketQRCode;
