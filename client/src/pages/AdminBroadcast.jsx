import { useState } from "react";
import axios from "axios";
import { Button, Form, Card, Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

const AdminBroadcast = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const sendNotification = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/notify/broadcast`,
        { title, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("✅ Notification sent!");
      setTitle("");
      setMessage("");
    } catch (err) {
      toast.error("❌ Failed to send notification");
    }
  };

  return (
    <div style={{ backgroundColor: "#0f1f17", minHeight: "100vh", paddingTop: "60px", paddingBottom: "60px" }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="p-4 shadow-lg border-0 rounded-4 bg-dark text-white">
              <h4 className="fw-bold mb-4 text-center">📣 Send Notification</h4>
              <Form onSubmit={sendNotification}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-light border-0 rounded-3"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-light">Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="bg-light border-0 rounded-3"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="success" size="lg">
                    🚀 Send Notification
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminBroadcast;
