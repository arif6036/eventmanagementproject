import { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Modal,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfile,
  changePassword,
  deleteAccount,
} from "../redux/userSlice";
import { toast } from "react-toastify";

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [darkMode, setDarkMode] = useState(user?.darkMode || false);
  const [notifications, setNotifications] = useState(true);

  const [showPassModal, setShowPassModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Handle profile save
  const handleSave = async () => {
    try {
      await dispatch(
        updateProfile({ name, email, darkMode, notifications })
      ).unwrap();
      toast.success("✅ Profile updated");
    } catch (err) {
      toast.error("❌ Failed to update profile");
    }
  };

  // Handle password update
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) return toast.error("Passwords do not match");
    try {
      const result = await dispatch(
        changePassword({ currentPassword: oldPass, newPassword: newPass })
      ).unwrap();
      toast.success(result.message || "✅ Password updated");
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setShowPassModal(false);
    } catch (err) {
      toast.error(err.message || "❌ Failed to change password");
    }
  };

  // Handle account delete
  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteAccount()).unwrap();
      toast.success("✅ Account deleted");
    } catch (err) {
      toast.error("❌ Failed to delete account");
    }
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4">⚙️ Settings</h3>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Profile Info</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Preferences</h5>
          <Form.Check
            type="switch"
            id="darkMode"
            label="Enable Dark Mode"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <Form.Check
            type="switch"
            id="notifications"
            label="Enable Notifications"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </Card.Body>
      </Card>

      <div className="d-flex flex-wrap gap-3 justify-content-between">
        <Button variant="primary" onClick={handleSave}>
          💾 Save Settings
        </Button>
        <Button
          variant="outline-warning"
          onClick={() => setShowPassModal(true)}
        >
          🔐 Change Password
        </Button>
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
          🗑️ Delete Account
        </Button>
      </div>

      {/* 🔐 Password Modal */}
      <Modal show={showPassModal} onHide={() => setShowPassModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordChange}>
            <Form.Group className="mb-3">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Update Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* 🗑️ Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This action is permanent. Are you sure?</p>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Settings;
