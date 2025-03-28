import { useState } from "react";
import { registerUser } from "../api/authApi";
import {
  Form,
  Button,
  Container,
  Card,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/global.css";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  // ✅ Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!user.name.trim()) newErrors.name = "Name is required";

    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!user.password) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!user.confirmPassword) {
      newErrors.confirmPassword = "Please re-enter your password";
    } else if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // ✅ Submit Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError("");
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const { confirmPassword, ...userData } = user; // exclude confirmPassword before sending
      await registerUser(userData);
toast.success("Registration successful! Please check your email to verify your account.");
navigate("/verify-pending"); // 👈 redirect to a new page with instructions

    } catch (error) {
      console.error("Registration Error:", error);
      setFormError("Registration failed. Please try again.");
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-page bg-dark text-light">
      <Container className="d-flex justify-content-center align-items-center min-vh-100 px-3">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-4">
                <h2 className="text-center mb-4 fw-bold">Create Your Account</h2>

                {formError && <Alert variant="danger">{formError}</Alert>}

                <Form noValidate onSubmit={handleRegister}>
                  {/* Full Name */}
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Full Name"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={user.password}
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Re-enter Password"
                      value={user.confirmPassword}
                      onChange={(e) =>
                        setUser({ ...user, confirmPassword: e.target.value })
                      }
                      isInvalid={!!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Role */}
                  <Form.Group className="mb-4">
                    <Form.Label className="text-light">Select Role</Form.Label>
                    <Form.Select
                      value={user.role}
                      onChange={() =>
                        setUser({ ...user, role: "user" }) // Locked to "user"
                      }
                    >
                      <option value="user">User</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="success"
                    className="w-100 fw-semibold"
                  >
                    Register
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
