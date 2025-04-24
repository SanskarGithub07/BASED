import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, Package, ShoppingBag, AlertCircle, X, CreditCard, Info, MapPin, ChevronDown } from "lucide-react";
import FloatingIconsBackground from "@/components/xp-ui/FloatingiconsBackground";
import GlassCard from "@/components/xp-ui/GlassCard";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

  const fetchOrders = async () => {
    console.log("Attempting to fetch orders...");
    try {
      setLoading(true);
      setError(null);

      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.error("No auth token found");
        setError("You need to login first");
        setLoading(false);
        return;
      }

      console.log("Making API request to orders endpoint");
      const res = await fetch("http://localhost:8080/api/order/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API error:", res.status, errorText);
        throw new Error(`Failed to fetch orders: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log("Orders fetched successfully:", data);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(`Failed to load your orders: ${err.message}`);
    } finally {
      setLoading(false);
    }

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
      try {
        const res = await fetch(`http://localhost:8080/api/order/export-to-pdf/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to download receipt");
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
      } catch (err) {
        console.error("Error downloading receipt:", err);
        alert("Failed to download receipt. Please try again.");
      }
    };

    const openOrderDetails = (order) => {
      console.log("Opening order details for:", order);
      setSelectedOrder(order);
      setShowDetails(true);
    };

    const toggleExpandCard = (orderId) => {
      setExpandedCards(prev => ({
        ...prev,
        [orderId]: !prev[orderId]
      }));
    };

    useEffect(() => {
      console.log("OrdersPage component mounted");
      fetchOrders();
    }, []);

    // Safe function to get order ID display
    const getOrderIdDisplay = (order, index) => {
      if (!order || !order.id) return `#${index + 1}`;

      if (typeof order.id === 'string' && order.id.length > 0) {
        return `#${order.id.substring(0, 8)}`;
      }

      return `#${order.id}`;
    };

    // Get book cover image or placeholder
    const getBookCoverImage = (item) => {
      if (!item || !item.book) return "https://placehold.co/200x300/703fc9/ffffff?text=Book+Cover";

      if (item.book.imageUrl) {
        return item.book.imageUrl;
      }
      return "https://placehold.co/200x300/703fc9/ffffff?text=Book+Cover";
    };

    return (
      <div className="relative min-h-screen bg-white/90 dark:bg-black/90 py-8">
        <div className="absolute inset-0 z-0">
          <FloatingIconsBackground />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-4 sm:mb-0">
              Your Order History
            </h1>
            <Button
              onClick={fetchOrders}
              variant="outline"
              className="border border-purple-200 dark:border-purple-800"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh Orders"}
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-purple-400/30 h-16 w-16 mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading your orders...</p>
              </div>
            </div>
          ) : error ? (
            <GlassCard className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={fetchOrders} className="mt-2">Try Again</Button>
              {error.includes("login") && (
                <Button
                  variant="outline"
                  className="mt-2 ml-4"
                  onClick={() => window.location.href = '/signin'}
                >
                  Go to Login
                </Button>
              )}
            </GlassCard>
          ) : orders.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Looks like you haven't placed any orders yet.</p>
              <Button onClick={() => window.location.href = '/books/search'}>
                Browse Books
              </Button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {orders.map((order, index) => {
                const firstBookItem = order?.orderItems?.[0] || {};
                const isExpanded = expandedCards[order?.id] || false;
                const orderItems = order?.orderItems || [];
                const displayItems = isExpanded ? orderItems : orderItems.slice(0, 3);
                const hasMoreItems = orderItems.length > 3;

                return (
                  <motion.div
                    key={order?.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <GlassCard className="h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-medium">
                            Order {getOrderIdDisplay(order, index)}
                          </CardTitle>
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                            Completed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2 flex-grow flex flex-col">
                        <div className="flex flex-row gap-4">
                          {/* Book cover image - non-clickable */}
                          <div className="flex-shrink-0">
                            <div className="relative w-24 h-36 rounded-md overflow-hidden shadow-md">
                              <img
                                src={getBookCoverImage(firstBookItem)}
                                alt={`${firstBookItem?.book?.bookName || 'Book'} cover`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://placehold.co/200x300/703fc9/ffffff?text=Book+Cover";
                                }}
                              />
                            </div>
                          </div>

                          {/* Order information */}
                          <div className="flex-grow">
                            <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Date</span>
                              </div>
                              <div>{order?.createdDate ? new Date(order.createdDate).toLocaleDateString('en-US', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              }) : "Unknown"}</div>

                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Package className="h-4 w-4" />
                                <span>Items</span>
                              </div>
                              <div>{orderItems.length || 0} items</div>

                              <div className="col-span-2 mt-2">
                                <div className="font-medium">Total</div>
                                <div className="text-lg font-bold">₹{order?.totalPrice ? Number(order.totalPrice).toFixed(2) : "0.00"}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="space-y-3 mt-3 flex-grow">
                          <div className="text-sm font-medium">Items</div>
                          <div className={`space-y-2 ${hasMoreItems ? 'max-h-36 overflow-y-auto pr-2' : ''}`}>
                            {displayItems.map((item, itemIndex) => (
                              <div key={item?.id || itemIndex} className="flex justify-between text-sm">
                                <span className="font-medium line-clamp-1">{item?.book?.bookName || "Unknown Book"}</span>
                                <span className="text-muted-foreground whitespace-nowrap">
                                  {item?.quantity || 0} × ₹{item?.price ? Number(item.price).toFixed(2) : "0.00"}
                                </span>
                              </div>
                            ))}
                          </div>

                          {hasMoreItems && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpandCard(order.id)}
                              className="w-full text-xs mt-1 h-8 flex items-center justify-center"
                            >
                              {isExpanded ? "Show Less" : `Show All ${orderItems.length} Items`}
                              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </Button>
                          )}
                        </div>

                        {order?.id && (
                          <Button
                            className="w-full mt-4 gap-2"
                            variant="outline"
                            onClick={() => handleDownloadReceipt(order.id)}
                          >
                            <Download className="h-4 w-4" />
                            Download Receipt
                          </Button>
                        )}
                      </CardContent>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Order Details {selectedOrder?.id ? `#${selectedOrder.id.substring(0, 8)}` : ''}</span>
                <DialogClose className="ml-auto hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1">
                  <X className="h-4 w-4" />
                </DialogClose>
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground">Order Information</h3>
                    <p className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Ordered on: </span>
                      <span className="font-medium">{selectedOrder.createdDate
                        ? new Date(selectedOrder.createdDate).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })
                        : "Unknown"}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4" />
                      <span>Payment: </span>
                      <span className="font-medium">Successfully Completed</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground">Order Summary</h3>
                    <p className="flex items-center justify-between text-sm">
                      <span>Items:</span>
                      <span className="font-medium">{selectedOrder.orderItems?.length || 0}</span>
                    </p>
                    <p className="flex items-center justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-medium">₹{Number(selectedOrder.totalPrice || 0).toFixed(2)}</span>
                    </p>
                    <Separator />
                    <p className="flex items-center justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-lg">₹{Number(selectedOrder.totalPrice || 0).toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-4">Ordered Books</h3>
                <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-1">
                  {(selectedOrder.orderItems || []).map((item, idx) => (
                    <div key={item?.id || idx} className="flex gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-lg">
                      <div className="w-16 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                        <img
                          src={getBookCoverImage(item)}
                          alt={`${item?.book?.bookName || 'Book'} cover`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/200x300/703fc9/ffffff?text=Book+Cover";
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold">{item?.book?.bookName || "Unknown Book"}</h4>
                        <p className="text-sm text-muted-foreground">By {item?.book?.authorName || "Unknown Author"}</p>
                        <p className="text-sm text-muted-foreground">ISBN: {item?.book?.isbn || "Unknown"}</p>
                        <div className="flex justify-between items-end mt-2">
                          <p className="text-sm">{item?.quantity || 0} × ₹{item?.price ? Number(item.price).toFixed(2) : "0.00"}</p>
                          <p className="font-medium">₹{((item?.quantity || 0) * (item?.price || 0)).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => handleDownloadReceipt(selectedOrder.id)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }