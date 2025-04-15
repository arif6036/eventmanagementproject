import AppRoutes from "./routes/routes";
import NavigationBar from "./components/Navbar";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import NotificationListener from "./components/NotificationListener";

function App() {
  return (
    <>
      <NavigationBar />
      <Container fluid className="px-0">
        <AppRoutes /> 
        <NotificationListener />
        <ToastContainer position="top-right" autoClose={3000} />
      </Container>
      <Footer />
    </>
  );
}

export default App;
