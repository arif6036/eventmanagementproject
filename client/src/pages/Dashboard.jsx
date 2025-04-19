import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { 
  Users, 
  Calendar, 
  Ticket, 
  Shield, 
  CreditCard, 
  BarChart, 
  BellRing, 
  Star,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const CheckAnlitics = () => {
    if (user?.role === "admin") {
      navigate("/admin/analytics");
    } else {
      alert("Only admins can view.");
    }
  };
  const AddUser = () => {
    if (user?.role === "admin") {
      navigate("/admin/register-user");
    } else {
      alert("Only admins can add user.");
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access Denied! Admins only.");
      navigate("/");
    }
  }, [user, navigate]);

  const dashboardCards = [
    {
      title: "User Management",
      description: "Manage user accounts, roles, and permissions",
      icon: Users,
      path: "/admin/users",
      color: "primary",
      bgGradient: "bg-primary",
      stats: "2,345 Active Users",
      trend: "+12%",
      animation: "pulse"
    },
    {
      title: "Event Management",
      description: "Create, edit, and organize upcoming events",
      icon: Calendar,
      path: "/admin/events",
      color: "success",
      bgGradient: "bg-success",
      stats: "18 Upcoming Events",
      trend: "+5 This Week",
      animation: "float"
    },
    {
      title: "Tickets",
      description: "Track and manage ticket bookings",
      icon: Ticket,
      path: "/admin/tickets",
      color: "warning",
      bgGradient: "bg-warning",
      stats: "8,234 Sold This Month",
      trend: "+23%",
      animation: "bounce"
    },
    {
      title: "Payment Cards",
      description: "Oversee secure payment transactions",
      icon: CreditCard,
      path: "/admin/cards",
      color: "info",
      bgGradient: "bg-info",
      stats: "98% Success Rate",
      trend: "Excellent",
      animation: "slide"
    },
    {
      title: "Push Notifications",
      description: "Send real-time updates to all users",
      icon: BellRing,
      path: "/admin/broadcast",
      color: "danger",
      bgGradient: "bg-danger",
      stats: "Last sent: 2h ago",
      trend: "95% Reach",
      animation: "shake"
    },
    {
      title: "Analytics",
      description: "Track performance metrics and insights",
      icon: BarChart,
      path: "/admin/analytics",
      color: "secondary",
      bgGradient: "bg-secondary",
      stats: "$45,392 Revenue",
      trend: "+18% Growth",
      animation: "scale"
    },
    {
      title: "Review Management",
      description: "Monitor and respond to customer feedback",
      icon: Star,
      path: "/admin/reviews",
      color: "dark",
      bgGradient: "bg-dark",
      stats: "4.8/5 Average Rating",
      trend: "142 New Reviews",
      animation: "rotate"
    }
  ];

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        {/* Dashboard Header */}
        <div className="d-flex align-items-center justify-content-between mb-5">
          <div>
            <h1 className="display-6 fw-bold mb-1">
              <Shield className="me-2 text-primary" /> 
              Admin Dashboard
            </h1>
            <p className="text-muted">
              Welcome back, {user?.name || 'Admin'}! Here's what's happening today.
            </p>
          </div>
          <div>
            <Button variant="primary" className="rounded-pill px-4 shadow-3d" onClick={CheckAnlitics}>
              <TrendingUp size={18} className="me-2" />
              View Reports
              
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <Row className="g-4">
          {dashboardCards.map((card, index) => (
            <Col md={6} lg={4} key={index}>
              <Card 
                className="h-100 border-0 rounded-4 overflow-hidden dashboard-card-3d"
                style={{ 
                  transform: 'perspective(1000px)',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <div 
                  className="card-inner h-100"
                  style={{ 
                    borderTop: `4px solid var(--bs-${card.color})`,
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div 
                        className={`p-3 rounded-3 ${card.bgGradient} bg-opacity-10 icon-container`}
                        style={{ animation: `${card.animation} 2s infinite ease-in-out` }}
                      >
                        <card.icon size={28} className={`text-${card.color}`} />
                      </div>
                      <Button 
                        as={Link} 
                        to={card.path} 
                        variant={`outline-${card.color}`}
                        size="sm"
                        className="rounded-pill px-3 button-3d"
                      >
                        Access <ArrowRight size={16} className="ms-1" />
                      </Button>
                    </div>
                    
                    <h4 className="fw-bold mb-2">{card.title}</h4>
                    <p className="text-muted small mb-3">{card.description}</p>
                    
                    <div className="d-flex justify-content-between align-items-end mt-auto">
                      <div>
                        <p className="mb-0 fw-semibold">{card.stats}</p>
                        <small className={`text-${card.color === 'warning' ? 'warning' : 'success'}`}>
                          {card.trend}
                        </small>
                      </div>
                    </div>
                  </Card.Body>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Quick Actions Section */}
        <Row className="mt-5">
          <Col>
            <Card className="border-0 rounded-4 quick-actions-card">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">Quick Actions</h4>
                <div className="d-flex flex-wrap gap-3">
                  <Button variant="primary" className="rounded-pill px-4 action-button-3d" onClick={AddUser}>
                    <Users size={18} className="me-2" />
                    Add New User
                  </Button>
                  <Button variant="success" className="rounded-pill px-4 action-button-3d">
                    <Calendar size={18} className="me-2" />
                    Create Event
                  </Button>
                  <Button variant="warning" className="rounded-pill px-4 action-button-3d">
                    <BellRing size={18} className="me-2" />
                    Send Notification
                  </Button>
                  <Button variant="info" className="rounded-pill px-4 action-button-3d">
                    <BarChart size={18} className="me-2" />
                    Generate Report
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes slide {
            0% { transform: translateX(0); }
            50% { transform: translateX(5px); }
            100% { transform: translateX(0); }
          }
          
          @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
          }
          
          @keyframes scale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .dashboard-card-3d {
            perspective: 1000px;
            transform-style: preserve-3d;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2);
          }
          
          .dashboard-card-3d:hover {
            transform: perspective(1000px) rotateX(8deg) rotateY(-8deg) translateY(-10px) scale(1.02);
            box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.3);
          }
          
          .card-inner {
            position: relative;
            background: white;
            transition: all 0.3s ease-in-out;
            border-radius: inherit;
          }
          
          .card-inner::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
            border-radius: inherit;
            pointer-events: none;
          }
          
          .icon-container {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          
          .dashboard-card-3d:hover .icon-container {
            transform: translateZ(20px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          }
          
          .button-3d {
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .button-3d:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          }
          
          .quick-actions-card {
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
          }
          
          .quick-actions-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.25);
          }
          
          .action-button-3d {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
          }
          
          .action-button-3d:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          }
          
          .shadow-3d {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
          }
          
          .shadow-3d:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;