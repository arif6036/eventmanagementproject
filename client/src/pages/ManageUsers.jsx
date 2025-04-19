import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Alert,
  Spinner,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { Trash, Shield, Edit, UserPlus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ManageUsers = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

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
    if (!formData.name || !formData.email || (!editingUser && !formData.password)) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      if (editingUser) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/update-user/${editingUser}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("User updated.");
      } else {
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = users.map((u) => [u.name, u.email, u.role]);
    autoTable(doc, {
      head: [["Name", "Email", "Role"]],
      body: tableData,
    });
    doc.save("users.pdf");
  };

  const filteredUsers = users
    .filter((u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  return (
    <motion.div style={{ backgroundColor: "#1c4f3d", color: "#fff", minHeight: "100vh" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <Container className="py-5">
        <h2 className="text-center mb-4 text-success">
          <Shield className="me-2" /> Manage Users
        </h2>

        <Row className="align-items-center mb-3 g-2">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="🔍 Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ backgroundColor: "#2c6d55", color: "#fff", borderColor: "#21d19f" }}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ backgroundColor: "#2c6d55", color: "#fff", borderColor: "#21d19f" }}
            >
              <option value="asc">Sort A-Z</option>
              <option value="desc">Sort Z-A</option>
            </Form.Select>
          </Col>
          <Col md={3} className="text-end">
            <Button variant="outline-light" className="me-2" onClick={exportToPDF}>Export PDF</Button>
            <Button variant="success" onClick={openCreateModal}>
              <UserPlus className="me-2" size={18} /> Create User
            </Button>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="light" />
            <p className="mt-3">Loading users...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive variant="dark">
            <thead style={{ backgroundColor: "#228b62" }}>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, index) => (
                <tr key={u._id}>
                  <td>{index + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {u._id !== user.id && (
                      <>
                        <Button size="sm" variant="info" className="me-2" onClick={() => openEditModal(u)}>
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteUser(u._id)}>
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
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </motion.div>
  );
};

export default ManageUsers;