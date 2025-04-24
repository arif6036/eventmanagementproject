import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import "../styles/global.css";

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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [navProgress, setNavProgress] = useState(0);
  const dropdownRef = useRef(null);

  // Memoize scroll handler for better performance
  const handleScroll = useCallback(() => {
    const currentScrollPosition = window.scrollY;
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = windowHeight > 0 ? (currentScrollPosition / windowHeight) * 100 : 0;
    
    setNavProgress(progress);
    setScrollPosition(currentScrollPosition);
    
    // Detect scroll direction
    if (currentScrollPosition < lastScrollPosition.current) {
      setIsScrollingUp(true);
    } else if (currentScrollPosition > 50) {
      setIsScrollingUp(false);
    }
    
    lastScrollPosition.current = currentScrollPosition;
  }, []);

  // Handle clicks outside of dropdown
  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveDropdown(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);
    
    // Enhanced loading animation
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);
    
    // Animate navbar items sequentially
    const navItems = document.querySelectorAll('.nav-item-wrapper');
    const animationTimers = [];
    
    navItems.forEach((item, index) => {
      const timer = setTimeout(() => {
        item.classList.add('nav-item-animated');
      }, 100 * (index + 1));
      animationTimers.push(timer);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(loadTimer);
      animationTimers.forEach(timer => clearTimeout(timer));
    };
  }, [handleScroll, handleClickOutside]);

  // Close dropdown when route changes
  useEffect(() => {
    setActiveDropdown(null);
    setExpanded(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const closeMenu = () => setExpanded(false);

  const toggleDropdown = (dropdownId, event) => {
    event.preventDefault();
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const renderNavLink = useCallback((to, label, options = {}) => {
    const { badge, dropdown, animation = true } = options;
    const isActive = location.pathname === to || 
                    (dropdown && dropdown.some(item => location.pathname === item.link));
    
    return (
      <div className={`nav-item-wrapper ${dropdown ? 'has-dropdown' : ''}`} ref={dropdown ? dropdownRef : null}>
        {dropdown ? (
          <div className="dropdown-container">
            <Nav.Link
              onClick={(e) => toggleDropdown(to, e)}
              className={`fancy-nav-link ${isActive ? "active" : ""} ${
                animation ? 'animate' : ''
              }`}
            >
              <span className="link-text">
                {label}
                {badge && <span className="nav-badge">{badge}</span>}
                <span className="dropdown-indicator">{activeDropdown === to ? '▲' : '▼'}</span>
              </span>
              <span className="hover-effect"></span>
            </Nav.Link>
            
            {activeDropdown === to && (
              <div className="dropdown-menu-custom">
                {dropdown.map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.link} 
                    className={`dropdown-item-custom ${location.pathname === item.link ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    {item.icon && <span className="dropdown-icon">{item.icon}</span>}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Nav.Link
            as={Link}
            to={to}
            onClick={closeMenu}
            className={`fancy-nav-link ${isActive ? "active" : ""} ${
              animation ? 'animate' : ''
            }`}
          >
            <span className="link-text">
              {label}
              {badge && <span className="nav-badge">{badge}</span>}
            </span>
            <span className="hover-effect"></span>
          </Nav.Link>
        )}
      </div>
    );
  }, [location.pathname, activeDropdown, closeMenu]);

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
        <Container fluid="lg" className="px-3 px-lg-4">
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
            className={`custom-toggler ${isLoaded ? "loaded" : ""} ${expanded ? "active" : ""}`}
          >
            <span className="toggler-icon-wrapper">
              <span className="toggler-icon"></span>
              <span className="toggler-icon"></span>
              <span className="toggler-icon"></span>
            </span>
          </Navbar.Toggle>

          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto nav-links-container align-items-lg-center">
              {renderNavLink("/", "Home")}
              {renderNavLink("/events", "Events controls", {
                badge: "New",
              })}

              {user ? (
                <>
                  {renderNavLink("/my-tickets", "My Tickets")}
                  
                  {user.role === "admin" && (
                    <>
                      {renderNavLink("/dashboard", "Admin Activity", {
                        dropdown: [
                          { label: "Admin Panel", link: "/dashboard", icon: "🗂️" },
                          { label: "Analytics", link: "/admin/analytics", icon: "📊" },
                          { label: "User Management", link: "/admin/users" , icon: "👥" },
                          { label: "Settings", link: "/settings", icon: "⚙️" }
                        ]
                      })}
                      {renderNavLink("/registerevent", "Register Event")}
                    </>
                  )}

                  <div className="nav-item-wrapper profile-section d-flex align-items-center">
                    <div className="user-profile">
                      <div className="user-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span className="user-name d-none d-lg-inline">{user.name || "User"}</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="animated-button logout-btn ms-3"
                      onClick={handleLogout}
                    >
                      <span className="button-text d-none d-sm-inline">Logout</span>
                      <span className="button-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="d-flex flex-column flex-lg-row align-items-lg-center mt-3 mt-lg-0">
                  <div className="d-flex auth-links mb-3 mb-lg-0">
                    {renderNavLink("/login", "Login")}
                    {renderNavLink("/register", "Register")}
                  </div>
                  
                  <Button
                    as={Link}
                    to="/login"
                    onClick={closeMenu}
                    className="animated-button cta-button ms-lg-3"
                  >
                    <span className="button-content">
                      <span className="button-text">Get Started</span>
                      <span className="button-icon">→</span>
                    </span>
                    <span className="button-glow"></span>
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default memo(NavigationBar);