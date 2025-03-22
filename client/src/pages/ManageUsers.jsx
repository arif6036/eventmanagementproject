import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Alert, Spinner, Modal, Form } from "react-bootstrap";
import { Trash, Shield, Edit, UserPlus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access Denied! Admins only.");
      navigate("/");
      return;
    }

    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user.id) {
      toast.error("You cannot delete your own account.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/delete-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== userId));
      toast.success("User deleted.");
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openCreateModal = () => {
    setFormData({ name: "", email: "", role: "user", password: "" });
    setEditingUser(null);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setFormData({ name: user.name, email: user.email, role: user.role, password: "" });
    setEditingUser(user._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        // Update user
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/update-user/${editingUser}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("User updated.");
      } else {
        // Create new user
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, formData);
        toast.success("User created.");
      }

      fetchUsers();
      setShowModal(false);
    } catch (err) {
      toast.error("Operation failed.");
      console.error(err);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">
        <Shield className="me-2" /> Manage Users
      </h2>

      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={openCreateModal}>
          <UserPlus className="me-2" size={18} />
          Create User
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-3">Loading users...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u._id}>
                <td>{index + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.role !== "admin" && (
                    <>
                      <Button
                        size="sm"
                        variant="info"
                        className="me-2"
                        onClick={() => openEditModal(u)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteUser(u._id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal for Create/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Create User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={formData.email} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleInputChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            {!editingUser && (
              <Form.Group className="mb-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageUsers;
