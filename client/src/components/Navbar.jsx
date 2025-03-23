import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NavigationBar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false); // manage collapse on mobile

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    setTimeout(() => setIsLoaded(true), 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const closeMenu = () => setExpanded(false);

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      className={`modern-navbar fixed-top ${
        scrollPosition > 50 ? "scrolled" : ""
      } ${isLoaded ? "loaded" : ""}`}
      bg="dark"
      variant="dark"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <span className="brand-text">Event</span>
          <span className="brand-accent"> Ease</span>
          <span className="brand-dot">.</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={() => setExpanded(!expanded)}
          className={`custom-toggler ${isLoaded ? "loaded" : ""}`}
        >
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto nav-links-container">
            <div className="nav-item-wrapper">
              <Nav.Link
                as={Link}
                to="/"
                onClick={closeMenu}
                className={`fancy-nav-link ${location.pathname === "/" ? "active" : ""}`}
              >
                Home <span className="hover-effect"></span>
              </Nav.Link>
            </div>

            <div className="nav-item-wrapper">
              <Nav.Link
                as={Link}
                to="/events"
                onClick={closeMenu}
                className={`fancy-nav-link ${location.pathname === "/events" ? "active" : ""}`}
              >
                Events <span className="hover-effect"></span>
              </Nav.Link>
            </div>

            {user ? (
              <>
                <div className="nav-item-wrapper">
                  <Nav.Link
                    as={Link}
                    to="/my-tickets"
                    onClick={closeMenu}
                    className={`fancy-nav-link ${location.pathname === "/my-tickets" ? "active" : ""}`}
                  >
                    My Tickets <span className="hover-effect"></span>
                  </Nav.Link>
                </div>

                {user.role === "admin" && (
                  <>
                    <div className="nav-item-wrapper">
                      <Nav.Link
                        as={Link}
                        to="/dashboard"
                        onClick={closeMenu}
                        className={`fancy-nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                      >
                        Admin Panel <span className="hover-effect"></span>
                      </Nav.Link>
                    </div>

                    <div className="nav-item-wrapper">
                      <Nav.Link
                        as={Link}
                        to="/registerevent"
                        onClick={closeMenu}
                        className={`fancy-nav-link ${location.pathname === "/registerevent" ? "active" : ""}`}
                      >
                        Register Event <span className="hover-effect"></span>
                      </Nav.Link>
                    </div>
                  </>
                )}

                <Button
                  variant="outline"
                  className="animated-button logout-btn ms-2 mt-2 mt-lg-0"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  <span className="button-text">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <div className="nav-item-wrapper">
                  <Nav.Link
                    as={Link}
                    to="/login"
                    onClick={closeMenu}
                    className={`fancy-nav-link ${location.pathname === "/login" ? "active" : ""}`}
                  >
                    Login <span className="hover-effect"></span>
                  </Nav.Link>
                </div>

                <div className="nav-item-wrapper">
                  <Nav.Link
                    as={Link}
                    to="/register"
                    onClick={closeMenu}
                    className={`fancy-nav-link ${location.pathname === "/register" ? "active" : ""}`}
                  >
                    Register <span className="hover-effect"></span>
                  </Nav.Link>
                </div>

                <div className="nav-item-wrapper">
                  <Nav.Link
                    as={Link}
                    to="/gallery"
                    onClick={closeMenu}
                    className={`fancy-nav-link ${location.pathname === "/gallery" ? "active" : ""}`}
                  >
                    Gallery <span className="hover-effect"></span>
                  </Nav.Link>
                </div>

                <Button
                  as={Link}
                  to="/login"
                  onClick={closeMenu}
                  className="animated-button primary-btn mt-2 mt-lg-0 ms-lg-3"
                >
                  <span className="button-text">Get Started</span>
                  <span className="button-shine"></span>
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
