import { Container, Card } from "react-bootstrap";
import { MailCheck } from "lucide-react";
import { Link } from "react-router-dom";

const VerifyPending = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 text-center shadow-lg" style={{ maxWidth: "500px" }}>
        <MailCheck size={48} className="text-success mb-3 mx-auto" />
        <h3>Email Verification Required</h3>
        <p className="mt-3">
          We've sent a verification link to your email. Please check your inbox and verify your account before logging in.
        </p>
        <p className="text-muted">Didn’t get it? Check your spam or junk folder.</p>
        <Link to="/login" className="btn btn-outline-success mt-3">Back to Login</Link>
      </Card>
    </Container>
  );
};

export default VerifyPending;
