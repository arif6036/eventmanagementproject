import { useSelector } from "react-redux";
import AppRoutes from "./routes/routes";
import NavigationBar from "./components/Navbar";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationListener from "./components/NotificationListener";

function App() {
  const { user } = useSelector((state) => state.auth);
  const darkMode = user?.darkMode;

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <NavigationBar />
      <Container fluid className="px-10 py-4" style={{ minHeight: "100vh" }}>
        <AppRoutes />
        <NotificationListener />
        <ToastContainer position="top-right" autoClose={3000} />
      </Container>
      <Footer />
    </div>
  );
}

export default App;
