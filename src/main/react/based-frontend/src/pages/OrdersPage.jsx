import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loadStripe } from "@stripe/stripe-js";

const publisherApiKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publisherApiKey);

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:8080/api/order/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    const data = await res.json();
    setOrders(data);
  };

  const handleCheckout = async () => {
    const res = await fetch("http://localhost:8080/api/order/create-checkout-session", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId });
  };

  const handleDownloadReceipt = async (orderId) => {
    const res = await fetch(`http://localhost:8080/api/order/export-to-pdf/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!res.ok) {
      alert("Failed to download receipt.");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `order_${orderId}_receipt.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Your Orders</h1>
      <Button onClick={handleCheckout}>Proceed to Checkout</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4 space-y-2">
              <p><span className="font-semibold">Order ID:</span> {order.id}</p>
              <p><span className="font-semibold">Total Price:</span> ${order.totalPrice}</p>
              <p><span className="font-semibold">Date:</span> {new Date(order.createdDate).toLocaleString()}</p>
              <ul className="list-disc ml-5">
                {order.orderItems.map((item) => (
                  <li key={item.id}>
                    {item.book.bookName} - Qty: {item.quantity} - ${item.price}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-2"
                variant="secondary"
                onClick={() => handleDownloadReceipt(order.id)}
              >
                Download Receipt
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
