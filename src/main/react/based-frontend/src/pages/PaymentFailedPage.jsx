import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import FloatingIconsBackground from "../components/xp-ui/FloatingiconsBackground";
import GlassCard from "../components/xp-ui/GlassCard";

export default function PaymentFailedPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-white/90 dark:bg-black/90 text-black dark:text-white transition-colors duration-300">
      <FloatingIconsBackground />

      <GlassCard className="w-full max-w-md backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Payment Failed</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center gap-6 p-6">
          <XCircle className="w-16 h-16 text-red-500" />
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold">Something went wrong</h2>
            <p>Your payment could not be processed. No charges were made.</p>
          </div>
          <div className="flex flex-col w-full gap-3 mt-4">
            <Button 
              onClick={() => navigate("/cart")}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white"
            >
              Return to Cart
            </Button>
            <Button 
              onClick={() => navigate("/books/search")}
              variant="outline"
              className="border border-red-400/30"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
}