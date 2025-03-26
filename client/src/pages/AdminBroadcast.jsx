import { useState } from "react";
import axios from "axios";
import { Button, Form, Card, Container } from "react-bootstrap";
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
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h5>📣 Send Notification to Users</h5>
        <Form onSubmit={sendNotification}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="success">
            Send Notification
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AdminBroadcast;
