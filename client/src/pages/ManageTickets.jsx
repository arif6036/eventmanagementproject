import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { Trash, Ticket, Calendar, User } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ManageTickets = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access Denied! Admins only.");
      navigate("/");
      return;
    }

    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure user and event data are populated in the response
        const fullData = response.data.map((ticket) => ({
          ...ticket,
          user: ticket.user || { name: "Unknown" },
          event: ticket.event || { title: "Unknown" },
        }));

        setTickets(fullData);
      } catch (error) {
        setError("Failed to fetch ticket bookings.");
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, navigate]);

  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
      toast.success("Ticket canceled successfully.");
    } catch (error) {
      toast.error("Failed to cancel ticket.");
      console.error("Error canceling ticket:", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const eventTitle = ticket.event?.title || "";
    const userName = ticket.user?.name || "";
    return (
      eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredTickets.map((t) => [
      t.user?.name,
      t.event?.title,
      t.ticketType,
      `$${t.price}`,
      t.quantity,
      t.isCheckedIn ? "Checked In" : "Not Checked In",
    ]);

    autoTable(doc, {
      head: [["User", "Event", "Type", "Price", "Quantity", "Status"]],
      body: tableData,
    });

    doc.save("tickets.pdf");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ backgroundColor: "#1c4f3d", minHeight: "100vh", color: "#fff" }}
    >
      <Container className="py-5">
        <h2 className="text-center mb-4 text-success">
          <Ticket className="me-2" /> Manage Tickets
        </h2>

        <Row className="align-items-center mb-3 g-2">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="🔍 Search by user or event"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ backgroundColor: "#2c6d55", color: "#fff", borderColor: "#21d19f" }}
            />
          </Col>
          <Col className="text-md-end">
            <Button variant="outline-light" onClick={exportToPDF}>Export PDF</Button>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="light" />
            <p className="mt-3 text-muted">Loading tickets...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive variant="dark" className="rounded overflow-hidden">
            <thead style={{ backgroundColor: "#228b62" }}>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Event</th>
                <th>Type</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket, index) => (
                <tr key={ticket._id}>
                  <td>{index + 1}</td>
                  <td>
                    <User size={16} className="me-1" />
                    {ticket.user?.name || "Unknown"}
                  </td>
                  <td>
                    <Calendar size={16} className="me-1" />
                    {ticket.event?.title || "Unknown"}
                  </td>
                  <td>{ticket.ticketType}</td>
                  <td>${ticket.price}</td>
                  <td>{ticket.quantity}</td>
                  <td>{ticket.isCheckedIn ? "Checked In" : "Not Checked In"}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleCancelTicket(ticket._id)}>
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </motion.div>
  );
};

export default ManageTickets;
