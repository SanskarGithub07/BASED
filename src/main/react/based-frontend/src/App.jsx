import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import RegisterForm from "./pages/RegistrationForm";
import VerifyUser from "./pages/VerifyUser";
import LoginForm from "./pages/LoginForm";
import CustomerDashboard from "./pages/CustomerDashboard";
import MainPage from "./pages/MainPage";
import Logout from "./pages/Logout";
import BookManagement from "./pages/BookManagement";
import BookGrid from "./BookGrid";
import BookManagementNew from "./pages/BookManagementNew";
import AuthPage from "./pages/AuthPage";
import Cart from "./Cart";
import BookRequestPage from "./pages/BookRequestPage";
import { Toaster } from "@/components/ui/sonner"; 

import Header from "./components/xp-ui/Header";
import { initTheme } from "./lib/utils.js";
import OrdersPage from "./pages/OrdersPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import OwnerDashboard from "./pages/OwnerDashboard";

export default function App() {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      <Toaster position="bottom-center" richColors />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative"
        >
          <Routes location={location}>
            <Route path="/" element={<MainPage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/verify" element={<VerifyUser />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/books" element={<BookManagement />} />
            <Route path="/books/request" element={<BookRequestPage />} />
            <Route path="/request/book" element={<BookRequestPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route
              path="/books/search"
              element={token ? <BookGrid /> : <Navigate to="/login" />}
            />
            {/* <Route path="/booksnew" element={<BookManagementNew />} /> */}
            <Route
              path="/cart"
              element={token ? <Cart /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={token ? <CustomerDashboard /> : <Navigate to="/login" />}
            />
            <Route 
              path="/payment/success"
              element={token? <PaymentSuccessPage /> : <Navigate to="/login" />}
            />
            <Route 
              path="/payment/failed" 
              element={token ? <PaymentFailedPage /> : <Navigate to="/login" />}
            />
            <Route path = "/admin/dashboard" element={<OwnerDashboard />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}