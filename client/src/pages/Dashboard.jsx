import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Users, Calendar, Ticket, Shield, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import { BarChart } from "lucide-react";


const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access Denied! Admins only.");
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">
        <Shield className="me-2" /> Admin Dashboard
      </h2>
      <Row className="g-4">
        {/* Manage Users */}
        <Col md={3}>
          <Card className="shadow-lg h-100 border-0 rounded-4">
            <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
              <Users size={40} />
              <h5 className="mt-3">Manage Users</h5>
              <p className="small">View, edit, and delete users.</p>
              <Button as={Link} to="/admin/users" variant="primary" size="sm">
                Go to Users
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Manage Events */}
        <Col md={3}>
          <Card className="shadow-lg h-100 border-0 rounded-4">
            <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
              <Calendar size={40} />
              <h5 className="mt-3">Manage Events</h5>
              <p className="small">Create, edit, and delete events.</p>
              <Button as={Link} to="/admin/events" variant="success" size="sm">
                Go to Events
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Manage Tickets */}
        <Col md={3}>
          <Card className="shadow-lg h-100 border-0 rounded-4">
            <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
              <Ticket size={40} />
              <h5 className="mt-3">Manage Tickets</h5>
              <p className="small">View and manage ticket bookings.</p>
              <Button as={Link} to="/admin/tickets" variant="warning" size="sm">
                Go to Tickets
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Manage Cards */}
        <Col md={3}>
          <Card className="shadow-lg h-100 border-0 rounded-4">
            <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
              <CreditCard size={40} />
              <h5 className="mt-3">Manage Cards</h5>
              <p className="small">Administer stored card details.</p>
              <Button as={Link} to="/admin/cards" variant="info" size="sm">
                Go to Cards
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-lg h-100 border-0 rounded-4">
            <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
              <div className="bg-info bg-gradient p-3 rounded-circle d-inline-flex justify-content-center align-items-center">
                <CreditCard size={32} className="text-white" />
              </div>
              <h5 className="mt-3 fw-bold">Push Notification</h5>
              <p className="small text-muted">Send real-time messages to all users.</p>
              <Button
                as={Link}
                to="/admin/broadcast"
                variant="info"
                className="mt-auto fw-semibold"
                size="sm"
              >
                Send Notification
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <BarChart size={40} />
              <h5 className="mt-3">Analytics</h5>
              <p className="small">Track stats and revenue</p>
              <Button as={Link} to="/admin/analytics" variant="dark" size="sm">
                View Analytics
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default Dashboard;
