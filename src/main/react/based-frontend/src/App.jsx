import { Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./pages/RegistrationForm";
import VerifyUser from "./pages/VerifyUser";
import LoginForm from "./pages/LoginForm";
import CustomerDashboard from "./pages/CustomerDashboard";
import MainPage from "./pages/MainPage";
import Logout from "./pages/Logout";
import BookManagement from "./pages/BookManagement";
import SampleButton from "./SampleButton";
import BookManagementNew from "./pages/BookManagementNew"


export default function App() {
  const token = localStorage.getItem("authToken");

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/verify" element={<VerifyUser />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/logout" element={<Logout />} />
      <Route path = "/books" element= {<BookManagement/>}/>
      <Route path="/booksnew" element={<BookManagementNew/>}/>
      <Route
        path="/dashboard"
        element={token ? <CustomerDashboard /> : <Navigate to="/login" />}
      />
{/*       <Route path = "/shadcnbutton" element = {<SampleButton/>}/> */}

{/* This leads to overriding the customer dashboard when logging in. */}
      {/* <Route path="*" element={<Navigate to="/login" />} /> */}
    </Routes>
  );
}

