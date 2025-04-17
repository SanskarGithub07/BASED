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


export default function BookRequestForm() {
  const [formData, setFormData] = useState({
    bookName: "",
    authorName: "",
    isbn: "",
    quantity: 1,
    additionalNotes: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // console.log("Submitting:", formData); // Debug log
      
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:8080/api/request/book", 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      // console.log("Response:", response); // Debug log
      toast.success(response.data);
    } catch (error) {
      console.error("Submission error:", {
        error: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data
        || error.message
        || "Failed to submit request";
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" richColors /> {}
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
      </GlassCard>
    </>
  );
}