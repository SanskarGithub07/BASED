import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import FloatingIconsBackground from "../components/xp-ui/FloatingiconsBackground";
import GlassCard from "../components/xp-ui/GlassCard";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get session_id from URL parameters
        const params = new URLSearchParams(location.search);
        const sessionId = params.get("session_id");
        
        if (!sessionId) {
          setError("Missing session information");
          setIsProcessing(false);
          return;
        }

        // Confirm the payment with backend
        await axios.post(
          "http://localhost:8080/api/order/add",
          null,
          {
            params: { sessionId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        
        setIsProcessing(false);
      } catch (err) {
        console.error("Error processing payment:", err);
        setError("Failed to process your order");
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [location]);

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-white/90 dark:bg-black/90 text-black dark:text-white transition-colors duration-300">
      <FloatingIconsBackground />

      <GlassCard className="w-full max-w-md backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Payment {isProcessing ? "Processing" : "Successful"}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center gap-6 p-6">
          {isProcessing ? (
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/30"></div>
              <p>Processing your payment...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>{error}</p>
              <Button 
                onClick={() => navigate("/cart")}
                className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                Return to Cart
              </Button>
            </div>
          ) : (
            <>
              <CheckCircle className="w-16 h-16 text-green-500" />
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold">Thank you for your purchase!</h2>
                <p>Your order has been successfully processed.</p>
              </div>
              <div className="flex flex-col w-full gap-3 mt-4">
                <Button 
                  onClick={() => navigate("/orders")}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                >
                  View My Orders
                </Button>
                <Button 
                  onClick={() => navigate("/books/search")}
                  variant="outline"
                  className="border border-purple-400/30"
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
}