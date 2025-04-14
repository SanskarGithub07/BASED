import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.warn("No token found.");
        navigate("/logout"); // still redirect
        return;
      }

      await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("authToken"); // clear token
      navigate("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/logout"); // fallback navigation
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <h1 className="text-3xl font-semibold text-blue-500 mb-8">
            Welcome to Customer Dashboard
          </h1>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/cart">View Cart</Link>
            </Button>

            <Button asChild className="w-full">
              <Link to="/books/search">Search For Books</Link>
            </Button>

            <Button onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
