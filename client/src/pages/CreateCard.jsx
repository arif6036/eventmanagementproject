import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Table,
  Spinner,
} from "react-bootstrap";
import {
  createCard,
  getAllCards,
  deleteCard,
  updateCard,
} from "../api/cardApi";
import { toast } from "react-toastify";


const CreateCard = () => {
  const [form, setForm] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    email: "",
    mobileNumber: "",
  });

  const [cards, setCards] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const data = await getAllCards();
      setCards(data);
    } catch (err) {
      toast.error("Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateCard(editingId, form);
        toast.success("Card updated successfully");
      } else {
        await createCard(form);
        toast.success("Card created successfully");
      }
      setForm({
        cardHolderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        email: "",
        mobileNumber: "",
      });
      setEditMode(false);
      setEditingId(null);
      fetchCards();
    } catch (err) {
      toast.error("Error saving card");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      await deleteCard(id);
      toast.success("Card deleted successfully");
      fetchCards();
    }
  };

  const handleEdit = (card) => {
    setForm(card);
    setEditMode(true);
    setEditingId(card._id);
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h4 className="mb-3 fw-bold">
              {editMode ? "✏️ Edit Card" : "➕ Create New Card"}
            </h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Card Holder Name</Form.Label>
                <Form.Control
                  name="cardHolderName"
                  value={form.cardHolderName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button type="submit" className="w-100" variant="primary">
                {editMode ? "Update Card" : "Create Card"}
              </Button>
            </Form>
          </Card>
        </Col>

        <Col md={6}>
          <h4 className="mb-3 fw-bold">💳 Saved Cards</h4>
          {loading ? (
            <Spinner animation="border" />
          ) : cards.length === 0 ? (
            <Alert variant="info">No cards available</Alert>
          ) : (
            <Table bordered responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Card</th>
                  <th>Expiry</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr key={card._id}>
                    <td>{card.cardHolderName}</td>
                    <td>{card.cardNumber}</td>
                    <td>{card.expiryDate}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(card)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(card._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CreateCard;
