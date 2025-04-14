import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🛒 Your Cart</h1>

      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{item.book.bookName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Author: {item.book.authorName}</p>
                <p>ISBN: {item.book.isbn}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.book.price.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}

          <div className="text-right pt-4">
            <p className="text-lg font-semibold">
              Total: ₹{totalCost.toFixed(2)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
