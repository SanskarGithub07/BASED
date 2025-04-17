import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function CustomerDashboard() {
  const navigate = useNavigate();

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
      title: "Book Search",
      description: "Find your next great read",
      link: "/books/search",
      icon: "🔍",
      className: "col-span-2 row-span-1 bg-blue-500/10"
    },
    {
      title: "Your Cart",
      description: "Review your selections",
      link: "/cart",
      icon: "🛒",
      className: "col-span-1 row-span-1 bg-purple-500/10"
    },
    {
      title: "Book Request",
      description: "Can't find what you need?",
      link: "/book/request",
      icon: "📚",
      className: "col-span-1 row-span-2 bg-green-500/10"
    },
    {
      title: "Order History",
      description: "Past purchases",
      link: "/orders",
      icon: "📦",
      className: "col-span-2 row-span-1 bg-amber-500/10"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <h1 className="text-3xl font-semibold text-blue-500 mb-8">
            Welcome to Customer Dashboard
          </h1>

        <div className="grid grid-cols-3 grid-rows-2 gap-6 max-w-4xl mx-auto">
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

          <GlassCard className="col-span-3 row-span-1 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg bg-gradient-to-br from-red-500/10 to-rose-600/10">
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
    </div>
  );
}