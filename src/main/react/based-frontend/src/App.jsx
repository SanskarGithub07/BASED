import { Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./components/RegistrationForm";
import VerifyUser from "./components/VerifyUser";
import LoginForm from "./components/LoginForm";
import CustomerDashboard from "./components/CustomerDashboard";
import MainPage from "./components/MainPage";
import Logout from "./components/Logout";

export default function App() {
  const token = localStorage.getItem("authToken");

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/verify" element={<VerifyUser />} />
      <Route path="/login" element={<LoginForm />} />
      <Route
        path="/dashboard"
        element={token ? <CustomerDashboard /> : <Navigate to="/login" />}
      />
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

