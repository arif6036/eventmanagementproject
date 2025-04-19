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
    <Container className="my-5">
      {/* Animated Header */}
      <div className="header-section mb-5">
        <h2 className="display-6 fw-bold text-gradient animate-title">
          Analytics Dashboard
        </h2>
        <p className="lead text-muted fade-in">Track and analyze your business performance</p>
      </div>

      {/* Export Options */}
      {stats.topEvents.length > 0 && (
        <Card className="mb-4 glass-effect hover-lift">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col xs={12} md={4}>
                <h5 className="fw-bold mb-3 mb-md-0">
                  <PulseIcon icon="📤" color="#6366f1" /> Export Options
                </h5>
              </Col>
              <Col xs={12} md={8}>
                <div className="d-flex flex-wrap gap-3 justify-content-md-end">
                  <Button
                    variant="primary"
                    className="floating-button"
                    onClick={() => exportTopEventsToExcel(stats.topEvents)}
                  >
                    <span className="button-icon">🏆</span> Top Events
                  </Button>
                  <Button
                    variant="warning"
                    className="floating-button"
                    onClick={() => exportFullAnalyticsToExcel(stats)}
                  >
                    <span className="button-icon">📋</span> Full Data
                  </Button>
                  <Button
                    variant="success"
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
      <Card className="mb-4 glass-effect hover-lift">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-4">
            <PulseIcon icon="🔍" color="#06b6d4" /> Date Range Filter
          </h5>
          <Form onSubmit={handleDateSubmit}>
            <Row className="g-4">
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">From Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setDateError("");
                    }}
                    className="form-control-lg glass-input"
                    max={toDate || undefined}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">To Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setDateError("");
                    }}
                    className="form-control-lg glass-input"
                    min={fromDate || undefined}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} className="d-flex align-items-end gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="btn-lg glass-button flex-grow-1"
                >
                  <span className="button-icon">🔍</span> Apply Filter
                </Button>
                <Button
                  type="button"
                  variant="outline-secondary"
                  className="btn-lg glass-button"
                  onClick={handleDateReset}
                >
                  <span className="rotating-icon">🔄</span>
                </Button>
              </Col>
            </Row>
            {dateError && (
              <Alert variant="danger" className="mt-3 animated-alert">
                <span className="alert-icon">❌</span> {dateError}
              </Alert>
            )}
            {(appliedFromDate || appliedToDate) && (
              <div className="mt-3">
                <Badge bg="info" className="px-3 py-2 me-2">
                  Active Filter: {appliedFromDate ? `From ${appliedFromDate}` : 'All Time'} - {appliedToDate ? `To ${appliedToDate}` : 'Present'}
                </Badge>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>

      {/* Summary Cards */}
      <Row className="g-4 mb-5">
        {[
          { title: "Total Users", value: stats.totalUsers, icon: "👥", gradient: GRADIENT_COLORS[0] },
          { title: "Total Events", value: stats.totalEvents, icon: "📅", gradient: GRADIENT_COLORS[1] },
          { title: "Total Tickets", value: stats.totalTickets, icon: "🎫", gradient: GRADIENT_COLORS[2] },
          { title: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: "💰", gradient: GRADIENT_COLORS[3] },
        ].map((item, index) => (
          <Col xs={12} sm={6} xl={3} key={item.title}>
            <Card
              className="border-0 stat-card"
              style={{
                background: `linear-gradient(135deg, ${item.gradient.primary}20 0%, ${item.gradient.secondary}20 100%)`,
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card.Body className="p-4">
                <div className="stat-content">
                  <div className={`stat-icon ${hoveredCard === index ? 'icon-bounce' : ''}`}>
                    <PulseIcon icon={item.icon} color={item.gradient.primary} />
                  </div>
                  <div className="stat-info">
                    <h6 className="text-muted mb-1">{item.title}</h6>
                    <h3 className="mb-0" style={{ color: item.gradient.primary }}>{item.value}</h3>
                  </div>
                </div>
                <div className="progress-bar-container mt-3">
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
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">
              <PulseIcon icon="📊" color="#10b981" /> Top 5 Booked Events
            </h5>
            <Badge bg="primary" className="pulse-badge">Live Data</Badge>
          </div>

          {stats.topEvents.length === 0 ? (
            <Alert variant="info" className="animated-alert mb-0">
              <span className="alert-icon">ℹ️</span>
              No booking data available for the selected date range.
            </Alert>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={stats.topEvents.map((ev) => ({
                  name: ev.event?.title || "Untitled",
                  tickets: ev.totalTickets,
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                />
                <Bar
                  dataKey="tickets"
                  radius={[8, 8, 0, 0]}
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
          )}
        </Card.Body>
      </Card>

      {/* CSS Styles for animations and effects */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        .text-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 3rem;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
          border-radius: 16px;
        }

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(31, 38, 135, 0.15);
        }

        .floating-button {
          border-radius: 25px;
          padding: 10px 24px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .floating-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .button-icon {
          margin-right: 8px;
          display: inline-block;
          animation: icon-pulse 2s infinite;
        }

        .glass-input {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(8px);
        }

        .glass-input:focus {
          background: rgba(255, 255, 255, 0.95);
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .glass-button {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .glass-button:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-2px);
        }

        .glass-button.btn-primary {
          background: rgba(99, 102, 241, 0.9);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: white;
        }

        .glass-button.btn-primary:hover {
          background: rgba(99, 102, 241, 1);
        }

        .rotating-icon {
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .glass-button:hover .rotating-icon {
          transform: rotate(180deg);
        }

        .stat-card {
          transition: all 0.3s ease;
          overflow: hidden;
          position: relative;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: rotate(45deg);
          transition: all 0.6s ease;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .stat-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          transition: transform 0.3s ease;
        }

        .icon-bounce {
          animation: bounce 1s ease infinite;
        }

        .pulse-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .icon-pulse {
          font-size: 24px;
          position: relative;
          z-index: 2;
          animation: icon-pulse 2s infinite;
        }

        .pulse-icon::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: pulse-expand 2s infinite;
          opacity: 0;
        }

        .progress-bar-container {
          height: 6px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
          overflow: hidden;
        }

        .custom-progress-bar {
          height: 100%;
          border-radius: 3px;
          animation: progress-grow 1.5s ease-out;
        }

        .pulse-badge {
          animation: badge-pulse 2s infinite;
          font-weight: 600;
          padding: 8px 16px;
        }

        .animated-alert {
          animation: slide-in 0.5s ease-out;
          border-radius: 12px;
          border: none;
          padding: 16px 24px;
        }

        .alert-icon {
          margin-right: 10px;
          font-size: 20px;
        }

        .custom-spinner {
          display: flex;
          gap: 8px;
        }

        .spinner-dot {
          width: 12px;
          height: 12px;
          background: #6366f1;
          border-radius: 50%;
          animation: spinner-bounce 1.5s ease-in-out infinite;
        }

        .animate-title {
          animation: slide-in 0.8s ease-out;
        }

        .fade-in {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .bar-cell {
          animation: bar-grow 1.5s ease-out;
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes icon-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-expand {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes badge-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes spinner-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes progress-grow {
          from {
            width: 0;
          }
        }

        @keyframes bar-grow {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </Container>
  );
};

export default AdminAnalytics;