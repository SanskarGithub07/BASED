import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./pages/RegistrationForm";
import VerifyUser from "./pages/VerifyUser";
import LoginForm from "./pages/LoginForm";
import CustomerDashboard from "./pages/CustomerDashboard";
import MainPage from "./pages/MainPage";
import Logout from "./pages/Logout";
import BookManagement from "./pages/BookManagement";
import BookGrid from "./BookGrid";
import BookManagementNew from "./pages/BookManagementNew"
import AuthPage from "./pages/AuthPage";
import Cart from "./Cart";

import Header from "./components/xp-ui/Header";
import { initTheme } from "./lib/utils.js";

export default function App() {
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    initTheme(); // Run only once when App mounts
  }, []);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verify" element={<VerifyUser />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/books" element={<BookManagement />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/books/search"
          element= {token ? <BookGrid /> : <Navigate to="/login" />}
        />
        <Route path="/booksnew" element={<BookManagementNew />} />
        <Route 
          path="/cart" 
          element={token ? <Cart /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={token ? <CustomerDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  )
}
