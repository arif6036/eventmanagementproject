import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const NavigationBar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const lastScrollPosition = useRef(0);
  const [navProgress, setNavProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (currentScrollPosition / windowHeight) * 100;
      
      setNavProgress(progress);
      setScrollPosition(currentScrollPosition);
      
      // Detect scroll direction with better UX
      if (currentScrollPosition < lastScrollPosition.current) {
        setIsScrollingUp(true);
      } else if (currentScrollPosition > lastScrollPosition.current && currentScrollPosition > 80) {
        setIsScrollingUp(false);
      }
      
      lastScrollPosition.current = currentScrollPosition;
    };

    window.addEventListener("scroll", handleScroll);
    
    // Loading animation
    setTimeout(() => setIsLoaded(true), 100);
    
    // Animate navbar items
    const navItems = document.querySelectorAll('.nav-item-wrapper');
    navItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('nav-item-animated');
      }, 100 * (index + 1));
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const closeMenu = () => setExpanded(false);

  const renderNavLink = (to, label, options = {}) => {
    const { badge, dropdown } = options;
    return (
      <div className="nav-item-wrapper">
        <Nav.Link
          as={Link}
          to={to}
          onClick={closeMenu}
          className={`fancy-nav-link ${location.pathname === to ? "active" : ""}`}
        >
          <span className="link-text">
            {label}
            {badge && <span className="nav-badge">{badge}</span>}
          </span>
          <span className="link-underline"></span>
          <span className="link-background"></span>
        </Nav.Link>
        {dropdown && (
          <div className="dropdown-menu-custom">
            {dropdown.map((item, index) => (
              <Link 
                key={index} 
                to={item.link} 
                className="dropdown-item-custom"
                onClick={closeMenu}
              >
                <span className="dropdown-icon">{item.icon}</span>
                <span className="dropdown-text">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${navProgress}%` }} />
      
      <Navbar
        expand="lg"
        expanded={expanded}
        className={`modern-navbar fixed-top ${
          scrollPosition > 50 ? "scrolled" : ""
        } ${isLoaded ? "loaded" : ""} ${!isScrollingUp ? "hidden-navbar" : ""}`}
        bg="dark"
        variant="dark"
      >
        <Container>
          <div className="navbar-content">
            <Navbar.Brand as={Link} to="/" className="brand-logo">
              <div className="brand-container">
                <span className="brand-icon-wrapper">
                  <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="brand-text">Event</span>
                <span className="brand-accent">Ease</span>
                <span className="brand-dot">.</span>
              </div>
            </Navbar.Brand>

            <Navbar.Toggle
              aria-controls="navbar-nav"
              onClick={() => setExpanded(!expanded)}
              className={`custom-toggler ${expanded ? "active" : ""}`}
            >
              <span className="toggler-icon-wrapper">
                <span className="toggler-icon"></span>
                <span className="toggler-icon"></span>
                <span className="toggler-icon"></span>
              </span>
            </Navbar.Toggle>

            <Navbar.Collapse id="navbar-nav">
              <Nav className="ms-auto nav-links-container">
                {renderNavLink("/", "Home")}
                {renderNavLink("/events", "Events", {
                  badge: "New",
                  dropdown: [
                    { label: "Upcoming Events", link: "/events/upcoming", icon: "📅" },
                    { label: "Past Events", link: "/events/past", icon: "🕒" },
                    { label: "Popular Events", link: "/events/popular", icon: "⭐" }
                  ]
                })}

                {user ? (
                  <>
                    {renderNavLink("/my-tickets", "My Tickets")}
                    
                    {user.role === "admin" && (
                      <>
                        {renderNavLink("/dashboard", "Admin Panel", {
                          dropdown: [
                            { label: "Analytics", link: "/dashboard/analytics", icon: "📊" },
                            { label: "User Management", link: "/dashboard/users", icon: "👥" },
                            { label: "Settings", link: "/dashboard/settings", icon: "⚙️" }
                          ]
                        })}
                        {renderNavLink("/registerevent", "Register Event")}
                      </>
                    )}

                    <div className="nav-item-wrapper user-section">
                      <div className="user-profile">
                        <div className="user-avatar">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="user-name">{user.name || "User"}</span>
                        <div className="user-dropdown-icon">▼</div>
                      </div>
                      <div className="user-dropdown-menu">
                        <Link to="/profile" className="user-dropdown-item" onClick={closeMenu}>
                          <span className="dropdown-icon">👤</span>
                          Profile
                        </Link>
                        <Link to="/settings" className="user-dropdown-item" onClick={closeMenu}>
                          <span className="dropdown-icon">⚙️</span>
                          Settings
                        </Link>
                        <button 
                          className="user-dropdown-item logout-item" 
                          onClick={() => {
                            handleLogout();
                            closeMenu();
                          }}
                        >
                          <span className="dropdown-icon">🚪</span>
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {renderNavLink("/login", "Login")}
                    {renderNavLink("/register", "Register")}
                    
                    <div className="nav-item-wrapper">
                      <Button
                        as={Link}
                        to="/login"
                        onClick={closeMenu}
                        className="cta-button get-started-btn"
                      >
                        <span className="button-content">
                          <span className="button-text">Get Started</span>
                          <span className="button-arrow">→</span>
                        </span>
                        <span className="button-bg"></span>
                      </Button>
                    </div>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default NavigationBar;