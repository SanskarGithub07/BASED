import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; 
import { ShoppingBag } from "lucide-react";
import {
  Card as CartCard,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FloatingIconsBackground from "@/components/xp-ui/FloatingiconsBackground";
import GlassCard from "@/components/xp-ui/GlassCard";
import { loadStripe } from "@stripe/stripe-js";

const publisherApiKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publisherApiKey);

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.get("http://localhost:8080/api/cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data.cartItems || []);
      setTotalCost(res.data.totalCost || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCartItem = async (cartItemId) => {
    try {
      const token = localStorage.getItem("authToken");

      await axios.delete(`http://localhost:8080/api/cart/delete/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      const updatedItems = cartItems.filter((item) => item.id !== cartItemId);
      setCartItems(updatedItems);

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.book.price * item.quantity,
        0
      );
      setTotalCost(newTotal);
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const token = localStorage.getItem("authToken");
      
      const response = await fetch("http://localhost:8080/api/order/create-checkout-session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }
      
      const { sessionId } = await response.json();
      
      // Use Stripe to redirect to checkout
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({ sessionId });
      
      if (result.error) {
        console.error("Stripe redirect error:", result.error);
        throw new Error(result.error.message);
      }
    } catch (err) {
      console.error("Error during checkout:", err);
      alert("Failed to proceed to checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="relative min-h-screen bg-white/90 dark:bg-black/90 py-8">
      <div className="absolute inset-0 z-0">
        <FloatingIconsBackground />
      </div>
      
      <div className="relative z-10 container mx-auto px-4">
        <GlassCard className="p-6">
          <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-purple-400/30 h-16 w-16 mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading your cart...</p>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg text-muted-foreground mb-6">Your cart is empty.</p>
              <Button onClick={() => navigate('/books/search')}>
                Browse Books
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                  <CartCard
                    key={item.id}
                    className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                  >
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle>{item.book.bookName}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteCartItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100/20"
                        >
                          Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                      <p><span className="font-medium">Author:</span> {item.book.authorName}</p>
                      <p><span className="font-medium">ISBN:</span> {item.book.isbn}</p>
                      <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                      <p><span className="font-medium">Price:</span> ₹{item.book.price.toFixed(2)}</p>
                    </CardContent>
                  </CartCard>
                ))}
              </div>

              <div className="flex flex-col items-end border-t border-gray-200 dark:border-gray-800 pt-4">
                <p className="text-lg font-semibold mb-4">
                  Total: ₹{totalCost.toFixed(2)}
                </p>
                
                <Button 
                  onClick={handleCheckout} 
                  disabled={checkoutLoading || cartItems.length === 0}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-2 rounded-lg text-lg font-medium"
                >
                  {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </div>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
}