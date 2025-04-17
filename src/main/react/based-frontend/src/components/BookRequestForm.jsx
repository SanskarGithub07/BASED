import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import GlassCard from "../components/xp-ui/GlassCard";
import RecentBookRequests from "./RecentBookRequests";

export default function BookRequestForm() {
  const [formData, setFormData] = useState({
    bookName: "",
    authorName: "",
    isbn: "",
    quantity: 1,
    additionalNotes: ""
  });
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("authToken");
      
      // Check if token exists before making the request
      if (!token) {
        toast.error("Please login to submit a request");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/request/book", 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          validateStatus: (status) => status < 500 // Don't throw for 4xx errors
        }
      );

      // Handle specific status codes
      if (response.status === 403) {
        toast.error("Session expired - please login again");
        localStorage.removeItem("authToken");
        // navigate("/login");
        return;
      }

      if (response.status === 200) {
        toast.success(response.data);
        setFormData({
          bookName: "",
          authorName: "",
          isbn: "",
          quantity: 1,
          additionalNotes: ""
        });
        setRefreshKey(prev => prev + 1);
      } else {
        // Handle other successful status codes (201, etc)
        toast.success("Request submitted successfully");
        setFormData({
          bookName: "",
          authorName: "",
          isbn: "",
          quantity: 1,
          additionalNotes: ""
        });
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      console.error("Full error object:", error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data
        || error.message
        || "Failed to submit request";
      
      if (error.response?.status === 403) {
        toast.error("Authentication failed - please login again");
        localStorage.removeItem("authToken");
        // navigate("/login");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" richColors />
      <GlassCard className="max-w-2xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Request a Book</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bookName">Book Title *</Label>
              <Input
                id="bookName"
                value={formData.bookName}
                onChange={(e) => setFormData({...formData, bookName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorName">Author *</Label>
              <Input
                id="authorName"
                value={formData.authorName}
                onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                placeholder="e.g. 978-3-16-148410-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>

        {/* Recent Requests Section */}
        <RecentBookRequests key={refreshKey} />
      </GlassCard>
    </>
  );
}