import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Form,
  Button,
} from "react-bootstrap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { fetchDashboardStats } from "../api/dashboardApi";
import {
  exportTopEventsToExcel,
  exportAnalyticsToExcel,
} from "../utils/exportToExcel";
import { exportFullAnalyticsToExcel } from "../utils/exportFullAnalytics";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardStats(fromDate, toDate);
        setStats(data);
      } catch (error) {
        console.error("Error loading analytics:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [fromDate, toDate]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">Unable to load analytics data.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center fw-bold text-success">
        📊 Admin Analytics Dashboard
      </h2>

      {/* 📥 Export Buttons */}
      {stats.topEvents.length > 0 && (
        <Card className="p-3 mb-4 shadow-sm border-0 rounded-4 bg-light">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <h5 className="text-muted mb-0">📤 Export Options</h5>
            <div className="d-flex flex-wrap gap-2">
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => exportTopEventsToExcel(stats.topEvents)}
              >
                🏆 Export Top Events
              </Button>
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => exportFullAnalyticsToExcel(stats)}
              >
                📋 Export Raw Data
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => exportAnalyticsToExcel(stats)}
              >
                📈 Export Summary
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 🔍 Date Filter */}
      <Card className="p-4 shadow-sm mb-4 border-0 rounded-4">
        <Form className="row g-3">
          <Form.Group as={Col} xs={12} md={4}>
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group as={Col} xs={12} md={4}>
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Form.Group>

          <Col xs={12} md={4} className="d-flex align-items-end">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
              🔁 Reset Filters
            </Button>
          </Col>
        </Form>
      </Card>

      {/* 📦 Summary Cards */}
      <Row className="g-4 mb-4">
        <Col xs={12} sm={6} md={3}>
          <Card className="text-center shadow-sm p-3 border-0 rounded-4 bg-light">
            <h6 className="text-muted">Total Users</h6>
            <h4 className="text-success fw-bold">{stats.totalUsers}</h4>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Card className="text-center shadow-sm p-3 border-0 rounded-4 bg-light">
            <h6 className="text-muted">Total Events</h6>
            <h4 className="text-success fw-bold">{stats.totalEvents}</h4>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Card className="text-center shadow-sm p-3 border-0 rounded-4 bg-light">
            <h6 className="text-muted">Total Tickets</h6>
            <h4 className="text-success fw-bold">{stats.totalTickets}</h4>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Card className="text-center shadow-sm p-3 border-0 rounded-4 bg-light">
            <h6 className="text-muted">Total Revenue</h6>
            <h4 className="text-success fw-bold">
              ${stats.totalRevenue.toFixed(2)}
            </h4>
          </Card>
        </Col>
      </Row>

      {/* 🎯 Top Events Chart */}
      <Card className="shadow-sm p-4 border-0 rounded-4">
        <h5 className="mb-4 fw-semibold">🎯 Top 5 Booked Events</h5>
        {stats.topEvents.length === 0 ? (
          <Alert variant="info">No booking data available for this range.</Alert>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={stats.topEvents.map((ev) => ({
                name: ev.event?.title || "Untitled",
                tickets: ev.totalTickets,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="tickets" fill="#198754" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </Container>
  );
};

export default AdminAnalytics;
