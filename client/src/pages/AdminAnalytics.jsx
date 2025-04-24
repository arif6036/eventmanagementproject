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
  Badge,
} from "react-bootstrap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { fetchDashboardStats } from "../api/dashboardApi";
import {
  exportTopEventsToExcel,
  exportAnalyticsToExcel,
} from "../utils/exportToExcel";
import { exportFullAnalyticsToExcel } from "../utils/exportFullAnalytics";
import "../styles/global.css"; // Import the separated CSS file

// Professional color palette
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'];
const GRADIENT_COLORS = [
  { primary: '#6366f1', secondary: '#a5b4fc' }, // Indigo
  { primary: '#06b6d4', secondary: '#67e8f9' }, // Cyan
  { primary: '#10b981', secondary: '#6ee7b7' }, // Green
  { primary: '#f59e0b', secondary: '#fcd34d' }, // Amber
];

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [dateError, setDateError] = useState("");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardStats(appliedFromDate, appliedToDate);
        setStats(data);
      } catch (error) {
        console.error("Error loading analytics:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [appliedFromDate, appliedToDate]);

  const handleDateSubmit = (e) => {
    e.preventDefault();
    setDateError("");

    // Validate date range
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (from > to) {
        setDateError("Start date cannot be later than end date");
        return;
      }
    }

    // Apply the date filter
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  const handleDateReset = () => {
    setFromDate("");
    setToDate("");
    setDateError("");
    setAppliedFromDate("");
    setAppliedToDate("");
  };

  const CustomSpinner = () => (
    <div className="custom-spinner">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="spinner-dot" style={{ animationDelay: `${i * 0.15}s` }}></div>
      ))}
    </div>
  );

  const PulseIcon = ({ icon, color }) => (
    <div className="pulse-icon" style={{ backgroundColor: `${color}15` }}>
      <span className="icon-pulse" style={{ color }}>{icon}</span>
    </div>
  );

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <CustomSpinner />
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger" className="animated-alert">
          <span className="alert-icon">⚠️</span>
          Unable to load analytics data. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="px-2 px-sm-3 px-md-4 py-3 py-md-4" paddingTop="20px">
      {/* Animated Header */}
      <div className="header-section mb-3 mb-md-4">
        <h2 className="fw-bold text-gradient animate-title" >
          Analytics Dashboard
        </h2>
        <p className="lead text-muted fade-in">Track and analyze your business performance</p>
      </div>

      {/* Export Options */}
      {stats.topEvents.length > 0 && (
        <Card className="mb-3 mb-md-4 glass-effect hover-lift">
          <Card.Body className="p-2 p-sm-3 p-md-4">
            <Row className="align-items-center">
              <Col xs={12} md={4} className="mb-2 mb-md-0">
                <h5 className="fw-bold mb-0 fs-6 fs-md-5">
                  <PulseIcon icon="📤" color="#6366f1" /> Export Options
                </h5>
              </Col>
              <Col xs={12} md={8}>
                <div className="d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                  <Button
                    variant="primary"
                    size="sm"
                    className="floating-button"
                    onClick={() => exportTopEventsToExcel(stats.topEvents)}
                  >
                    <span className="button-icon">🏆</span> Top Events
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    className="floating-button"
                    onClick={() => exportFullAnalyticsToExcel(stats)}
                  >
                    <span className="button-icon">📋</span> Full Data
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="floating-button"
                    onClick={() => exportAnalyticsToExcel(stats)}
                  >
                    <span className="button-icon">📈</span> Summary
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Date Filter */}
      <Card className="mb-3 mb-md-4 glass-effect hover-lift">
        <Card.Body className="p-2 p-sm-3 p-md-4">
          <h5 className="fw-bold mb-2 mb-md-3 fs-6 fs-md-5">
            <PulseIcon icon="🔍" color="#06b6d4" /> Date Range Filter
          </h5>
          <Form onSubmit={handleDateSubmit}>
            <Row className="g-2 g-md-3">
              <Col xs={12} sm={6} lg={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">From Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setDateError("");
                    }}
                    className="form-control-sm form-control-md-lg glass-input"
                    max={toDate || undefined}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">To Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setDateError("");
                    }}
                    className="form-control-sm form-control-md-lg glass-input"
                    min={fromDate || undefined}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} lg={4} className="d-flex align-items-end mt-2 mt-lg-0">
                <div className="d-flex gap-2 w-100">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="glass-button flex-grow-1"
                  >
                    <span className="button-icon">🔍</span> Apply
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    size="sm"
                    className="glass-button"
                    onClick={handleDateReset}
                  >
                    <span className="rotating-icon">🔄</span>
                  </Button>
                </div>
              </Col>
            </Row>
            {dateError && (
              <Alert variant="danger" className="mt-2 animated-alert p-2 small">
                <span className="alert-icon">❌</span> {dateError}
              </Alert>
            )}
            {(appliedFromDate || appliedToDate) && (
              <div className="mt-2">
                <Badge bg="info" className="px-2 py-1 me-2 small">
                  Filter: {appliedFromDate ? `From ${appliedFromDate}` : 'All Time'} - {appliedToDate ? `To ${appliedToDate}` : 'Present'}
                </Badge>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>

      {/* Summary Cards */}
      <Row className="g-2 g-md-3 g-xl-4 mb-3 mb-md-4">
        {[
          { title: "Total Users", value: stats.totalUsers, icon: "👥", gradient: GRADIENT_COLORS[0] },
          { title: "Total Events", value: stats.totalEvents, icon: "📅", gradient: GRADIENT_COLORS[1] },
          { title: "Total Tickets", value: stats.totalTickets, icon: "🎫", gradient: GRADIENT_COLORS[2] },
          { title: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: "💰", gradient: GRADIENT_COLORS[3] },
        ].map((item, index) => (
          <Col xs={6} sm={6} xl={3} key={item.title}>
            <Card
              className="border-0 stat-card h-100"
              style={{
                background: `linear-gradient(135deg, ${item.gradient.primary}20 0%, ${item.gradient.secondary}20 100%)`,
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card.Body className="d-flex flex-column p-2 p-sm-3">
                <div className="stat-content">
                  <div className={`stat-icon ${hoveredCard === index ? 'icon-bounce' : ''}`}>
                    <PulseIcon icon={item.icon} color={item.gradient.primary} />
                  </div>
                  <div className="stat-info">
                    <h6 className="text-muted mb-1 small">
                      {item.title}
                    </h6>
                    <h4 className="mb-0 fs-6 fs-md-4" style={{ color: item.gradient.primary }}>
                      {item.value}
                    </h4>
                  </div>
                </div>
                <div className="progress-bar-container mt-2 mt-md-3">
                  <div
                    className="custom-progress-bar"
                    style={{
                      width: `${Math.min((stats[Object.keys(stats)[index]] / Math.max(...Object.values(stats).filter(v => typeof v === 'number'))) * 100, 100)}%`,
                      background: `linear-gradient(90deg, ${item.gradient.primary}, ${item.gradient.secondary})`
                    }}
                  ></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Top Events Chart */}
      <Card className="border-0 glass-effect hover-lift">
        <Card.Body className="p-2 p-sm-3 p-md-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-2 mb-md-0 fs-6 fs-md-5">
              <PulseIcon icon="📊" color="#10b981" /> Top 5 Booked Events
            </h5>
            <Badge bg="primary" className="pulse-badge small">Live Data</Badge>
          </div>

          {stats.topEvents.length === 0 ? (
            <Alert variant="info" className="animated-alert mb-0 p-2">
              <span className="alert-icon">ℹ️</span>
              No booking data available for the selected date range.
            </Alert>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <BarChart
                  data={stats.topEvents.map((ev) => ({
                    name: ev.event?.title || "Untitled",
                    tickets: ev.totalTickets,
                  }))}
                  margin={{ top: 20, right: 5, left: 5, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    tickFormatter={(value) => value.length > 15 ? value.substr(0, 15) + '...' : value}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '12px'
                    }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  />
                  <Bar
                    dataKey="tickets"
                    radius={[4, 4, 0, 0]}
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {stats.topEvents.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        className="bar-cell"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminAnalytics;