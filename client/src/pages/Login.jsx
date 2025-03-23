import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/authSlice";
import { Form, Button, Container, Card, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import "../styles/global.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const resultAction = await dispatch(login({ email, password }));

      if (login.fulfilled.match(resultAction)) {
        toast.success("Login successful!");

        if (resultAction.payload.user) {
          localStorage.setItem("user", JSON.stringify(resultAction.payload.user));
        }

        navigate("/");
      } else {
        throw new Error(resultAction.payload || "Invalid email or password");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page bg-dark text-light">
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 p-3">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Header className="text-center bg-success text-white rounded-top-4 py-3">
                <h2 className="fw-bold mb-0">Welcome Back</h2>
              </Card.Header>

              <Card.Body className="p-4">
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-success text-white">
                        <FaEnvelope />
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="d-flex justify-content-between">
                      <Form.Label>Password</Form.Label>
                      <Link to="/forgot-password" className="text-warning text-decoration-none small">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-success text-white">
                        <FaLock />
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="success"
                    className="w-100 py-2 fw-semibold mt-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="me-2" />
                        Login
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>

              <Card.Footer className="text-center bg-light rounded-bottom-4 py-3">
                <span className="text-dark">Don't have an account? </span>
                <Link to="/register" className="text-success fw-bold text-decoration-none">
                  <FaUserPlus className="me-1" /> Register Now
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
