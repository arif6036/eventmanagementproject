import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Alert,
  Spinner,
  Image,
  Modal,
  Form,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  Trash,
  Edit,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getAllEvents,
  deleteEvent,
  updateEvent,
} from "../api/eventApi";
import { toast } from "react-toastify";
import "../styles/global.css";

const ManageEvents = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access Denied! Admins only.");
      navigate("/");
      return;
    }

    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (error) {
        setError("Failed to fetch events.");
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, navigate]);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(eventId);
      setEvents(events.filter((event) => event._id !== eventId));
      toast.success("Event deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete event.");
      console.error("Error deleting event:", error);
    }
  };

  const handleOpenEditModal = (event) => {
    setCurrentEvent({ ...event });
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateEvent = async () => {
    try {
      await updateEvent(currentEvent._id, currentEvent);
      toast.success("Event updated successfully.");
      setEvents((prev) =>
        prev.map((event) =>
          event._id === currentEvent._id ? currentEvent : event
        )
      );
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to update event.");
      console.error("Error updating event:", error);
    }
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date).toISOString().slice(0, 10);
    const isTitleMatch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const isTypeMatch = filterType === "" || event.eventType === filterType;
    const isFromMatch = !fromDate || eventDate >= fromDate;
    const isToMatch = !toDate || eventDate <= toDate;
    return isTitleMatch && isTypeMatch && isFromMatch && isToMatch;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const exportToCSV = () => {
    const headers = ["Title", "Date", "Time", "Venue", "Type", "Price"];
    const rows = filteredEvents.map((e) => [
      e.title,
      new Date(e.date).toLocaleDateString(),
      e.time,
      e.venue,
      e.eventType,
      e.ticketPrice,
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "events.csv");
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredEvents.map((e) => [
      e.title,
      new Date(e.date).toLocaleDateString(),
      e.time,
      e.venue,
      e.eventType,
      e.ticketPrice,
    ]);

    autoTable(doc, {
      head: [["Title", "Date", "Time", "Venue", "Type", "Price"]],
      body: tableData,
    });

    doc.save("events.pdf");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ backgroundColor: "#1f573a", color: "#fff" }}
      className="min-vh-100 p-4 rounded shadow-lg"
    >
      <Container className="py-3">
        <motion.h2
          className="text-center mb-4 fw-bold"
          style={{ color: "#238b62" }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Calendar className="me-2 text-white" /> Manage Events
        </motion.h2>

        <Form className="mb-4">
          <Row className="gy-2">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="🔍 Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ backgroundColor: "#2b7552", color: "#fff", borderColor: "#238b62" }}
              />
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ backgroundColor: "#2b7552", color: "#fff", borderColor: "#238b62" }}
              >
                <option value="">All Types</option>
                <option value="Conference">Conference</option>
                <option value="Concert">Concert</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ backgroundColor: "#2b7552", color: "#fff", borderColor: "#238b62" }}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ backgroundColor: "#2b7552", color: "#fff", borderColor: "#238b62" }}
              />
            </Col>
          </Row>
        </Form>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="mb-0">
            Showing <strong>{filteredEvents.length}</strong> result(s)
          </p>
          <div>
            <Button style={{ backgroundColor: "#238b62", border: "none" }} className="me-2" onClick={exportToCSV}>
              Export CSV
            </Button>
            <Button variant="warning" onClick={exportToPDF}>
              Export PDF
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="light" />
            <p className="mt-3 text-muted">Loading events...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.map((event, index) => (
                  <tr key={event._id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>
                      {event.image ? (
                        <Image
                          src={event.image}
                          alt={event.title}
                          width={50}
                          height={50}
                          rounded
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>
                    <td>{event.title}</td>
                    <td>
                      <Clock size={16} className="me-1" />
                      {new Date(event.date).toLocaleDateString()} - {event.time}
                    </td>
                    <td>
                      <MapPin size={16} className="me-1" />
                      {event.venue}
                    </td>
                    <td>{event.eventType}</td>
                    <td>${event.ticketPrice || "Free"}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleOpenEditModal(event)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination className="justify-content-center">
              {[...Array(totalPages).keys()].map((num) => (
                <Pagination.Item
                  key={num}
                  active={currentPage === num + 1}
                  onClick={() => setCurrentPage(num + 1)}
                >
                  {num + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentEvent && (
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    value={currentEvent.title}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={currentEvent.date?.slice(0, 10)}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    name="time"
                    value={currentEvent.time}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Venue</Form.Label>
                  <Form.Control
                    name="venue"
                    value={currentEvent.venue}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Event Type</Form.Label>
                  <Form.Control
                    name="eventType"
                    value={currentEvent.eventType}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Ticket Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="ticketPrice"
                    value={currentEvent.ticketPrice}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleUpdateEvent}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </motion.div>
  );
};

export default ManageEvents;
