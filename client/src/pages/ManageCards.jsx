import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getAllCards, createCard, updateCard, deleteCard } from "../api/cardApi";
import { toast } from "react-toastify";

const ManageCards = () => {
  const { user } = useSelector((state) => state.auth);
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchCards = async () => {
    try {
      setLoading(true);
      const data = await getAllCards(token);
      setCards(data);
    } catch (error) {
      toast.error("Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchCards();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await updateCard(editId, formData, token);
        toast.success("Card updated");
      } else {
        await createCard(formData, token);
        toast.success("Card created");
      }
      fetchCards();
      setShowModal(false);
      setFormData({});
      setEditId(null);
    } catch (error) {
      toast.error("Error saving card");
    }
  };

  const handleEdit = (card) => {
    setFormData(card);
    setEditId(card._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    try {
      await deleteCard(id, token);
      toast.success("Card deleted");
      fetchCards();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (user?.role !== "admin") {
    return (
      <Container className="py-5">
        <Alert variant="danger">Access Denied: Admins only</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Manage Cards</h2>
      <Button className="mb-3" onClick={() => { setShowModal(true); setFormData({}); setEditId(null); }}>
        + Add New Card
      </Button>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Card Holder</th>
            <th>Card Number</th>
            <th>Expiry</th>
            <th>CVV</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card, index) => (
            <tr key={card._id}>
              <td>{index + 1}</td>
              <td>{card.cardHolderName}</td>
              <td>{card.cardNumber}</td>
              <td>{card.expiryDate}</td>
              <td>{card.cvv}</td>
              <td>{card.email}</td>
              <td>{card.mobile}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(card)} className="me-2">Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(card._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Card" : "Create Card"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["cardHolderName", "cardNumber", "expiryDate", "cvv", "email", "mobile"].map((field) => (
              <Form.Group key={field} className="mb-3">
                <Form.Label>{field.replace(/([A-Z])/g, " $1").toUpperCase()}</Form.Label>
                <Form.Control
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                  placeholder={`Enter ${field}`}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editId ? "Update" : "Save"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageCards;
