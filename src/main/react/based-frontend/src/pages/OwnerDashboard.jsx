import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";
import FloatingIconsBackground from "../components/xp-ui/FloatingiconsBackground";
import GlassCard from "../components/xp-ui/GlassCard";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [lowStockBooks, setLowStockBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLowStockBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("You need to login to view this page.");
          setLoading(false);
          navigate("/login");
          return;
        }
  
        // Removed role verification - directly fetch low stock books
        const response = await axios.get(
          "http://localhost:8080/api/admin/low-stock-books",
          { 
            headers: { Authorization: `Bearer ${token}` },
            // Adding timeout to avoid hanging requests
            // timeout: 8000
          }
        );
        
        console.log("Low stock books response:", response.data);
        setLowStockBooks(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch low stock books:", error);
        
        let errorMessage = "Failed to load low stock books.";
        if (error.response) {
            if (error.response.status === 403) {
            errorMessage = "You don't have permission to access this resource. Please verify you have admin privileges.";
            // Redirect to login if forbidden
            // setTimeout(() => navigate("/login"), 2000);
            } else if (error.response.status === 401) {
            errorMessage = "Your session has expired. Please login again.";
            // Redirect to login if unauthorized
            // setTimeout(() => navigate("/login"), 2000);
            } else {
            errorMessage += ` Server error: ${error.response.status}`;
            }
        } else if (error.request) {
            errorMessage += " No response received from server. Please check your connection.";
        } else {
            errorMessage += ` ${error.message}`;
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };
  
    fetchLowStockBooks();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/logout");
        return;
      }
      await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("authToken");
      navigate("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/logout");
    }
  };

  const bentoCards = [
    {
      title: "Inventory Management",
      description: "Update book quantities",
      link: "/admin/inventory",
      icon: "📊",
      className: "col-span-1 row-span-1 bg-blue-500/10"
    },
    {
      title: "Add New Book",
      description: "Add new books to inventory",
      link: "/admin/books/add",
      icon: "➕",
      className: "col-span-1 row-span-1 bg-green-500/10"
    },
    {
      title: "Order Management",
      description: "View customer orders",
      link: "/admin/orders",
      icon: "📦",
      className: "col-span-1 row-span-1 bg-amber-500/10"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white/90 dark:bg-black/90 text-black dark:text-white transition-colors duration-300">
      <div className="absolute inset-0 z-0">
        <FloatingIconsBackground />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          Owner <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Dashboard</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {bentoCards.map((card, index) => (
            <GlassCard 
              key={index}
              className={`${card.className} backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition-all duration-300`}
            >
              <Link to={card.link} className="block h-full">
                <CardHeader className="p-0 mb-4">
                  <span className="text-3xl">{card.icon}</span>
                </CardHeader>
                <CardContent className="p-0">
                  <h3 className="text-xl font-semibold mb-1">{card.title}</h3>
                  <p className="text-sm opacity-80">{card.description}</p>
                </CardContent>
              </Link>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mb-8 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Low Stock Books</h2>
                {!loading && !error && (
                  <div className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full">
                    <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                      {lowStockBooks.length} items need attention
                    </span>
                  </div>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-pulse text-center">
                  <div className="h-8 w-8 rounded-full bg-purple-400/30 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading inventory data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">{error}</div>
            ) : lowStockBooks.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                All books are well-stocked!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {lowStockBooks.map(book => (
                  <div 
                    key={book.id} 
                    className="flex gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                  >
                    <div className="w-12 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                      <img 
                        src={book.imageUrl || "https://placehold.co/100x150/703fc9/ffffff?text=Book+Cover"} 
                        alt={`${book.bookName} cover`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/100x150/703fc9/ffffff?text=Book+Cover";
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm line-clamp-1">{book.bookName}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">By {book.authorName}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs">ISBN: {book.isbn}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          book.quantity === 0 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {book.quantity === 0 ? 'Out of stock' : `${book.quantity} left`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline"
                className="text-sm border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                onClick={() => navigate('/admin/inventory')}
              >
                Manage Inventory
              </Button>
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard className="backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg bg-gradient-to-br from-red-500/10 to-rose-600/10">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <Button
              onClick={handleLogout}
              className="w-full max-w-xs bg-red-500/90 dark:bg-red-600/90 backdrop-blur-md border border-white/30 text-white uppercase tracking-wide hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-200 py-6 text-lg"
            >
              Logout
            </Button>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}