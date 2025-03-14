import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import RegisterForm from "./components/RegistrationForm";
import VerifyUser from "./components/VerifyUser";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/verify" element={<VerifyUser />} />
        </Routes>
    </BrowserRouter>
);
