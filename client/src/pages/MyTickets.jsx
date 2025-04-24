import { useEffect, useState } from "react";
import { getUserTickets } from "../api/ticketApi";
import {
  Container,
  Table,
  Alert,
  Spinner,
  Button,
  Row,
  Col,
  Card,
  Form,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
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

  const filteredTickets = tickets.filter((ticket) =>
    ticket.event?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredTickets.map((t) => [
      t.event?.title,
      new Date(t.event?.date).toLocaleDateString(),
      t.ticketType || "Standard",
      `$${t.price?.toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [["Event", "Date", "Type", "Price"]],
      body: tableData,
    });

    doc.save("my-tickets.pdf");
  };

  const exportToCSV = () => {
    const headers = ["Event", "Date", "Type", "Price"];
    const rows = filteredTickets.map((t) => [
      t.event?.title,
      new Date(t.event?.date).toLocaleDateString(),
      t.ticketType || "Standard",
      `$${t.price?.toFixed(2)}`,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-tickets.csv";
    link.click();
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ backgroundColor: "#1c4f3d", minHeight: "100vh", color: "#fff" }}
    >
      <Container className="py-5" >
        <Row className="justify-content-center" >
          <Col xs={12} lg={10}>
            <motion.h2
              className="mb-4 text-center fw-bold"
              style={{ color: "white" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              🎟️ My Tickets
            </motion.h2>

            <Row className="align-items-center mb-4 g-2">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="🔍 Search by event title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ backgroundColor: "#2c6d55", color: "#fff", borderColor: "#21d19f" }}
                />
              </Col>
              <Col className="text-md-end">
                <Button variant="outline-light" className="me-2" onClick={exportToCSV}>Export CSV</Button>
                <Button variant="outline-warning" onClick={exportToPDF}>Export PDF</Button>
              </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            {filteredTickets.length === 0 ? (
              <Alert variant="info" className="text-center bg-dark text-white border-0 shadow">
                You haven’t booked any tickets yet.
              </Alert>
            ) : (
              <>
                {/* Desktop View */}
                <div className="d-none d-lg-block table-responsive shadow rounded overflow-hidden">
                  <Table bordered hover responsive variant="dark" className="mb-0">
                    <thead style={{ backgroundColor: "#228b62" }}>
                      <tr>
                        <th>#</th>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Ticket Type</th>
                        <th>Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map((ticket, index) => (
                        <tr key={ticket._id}>
                          <td>{index + 1}</td>
                          <td>{ticket.event?.title || "Unknown Event"}</td>
                          <td>{ticket.event ? new Date(ticket.event.date).toLocaleDateString() : "N/A"}</td>
                          <td>{ticket.ticketType || "Standard"}</td>
                          <td>${ticket.price?.toFixed(2)}</td>
                          <td>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => navigate(`/ticket/${ticket._id}/qrcode`)}
                            >
                              View QR
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Mobile View */}
                <div className="d-lg-none mt-4">
                  <Row className="g-4">
                    {filteredTickets.map((ticket) => (
                      <Col key={ticket._id} xs={12}>
                        <Card className="bg-dark text-white border-success border-2 shadow-sm rounded-4">
                          <Card.Body>
                            <Card.Title className="text-success fw-bold fs-5">
                              {ticket.event?.title}
                            </Card.Title>
                            <div><strong>Date:</strong> {new Date(ticket.event?.date).toLocaleDateString()}</div>
                            <div><strong>Ticket Type:</strong> {ticket.ticketType || "Standard"}</div>
                            <div><strong>Price:</strong> ${ticket.price?.toFixed(2)}</div>
                            <Button
                              variant="outline-light"
                              size="sm"
                              className="mt-3 w-100 rounded-pill"
                              onClick={() => navigate(`/ticket/${ticket._id}/qrcode`)}
                            >
                              🎫 View QR Code
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default MyTickets;