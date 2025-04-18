import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import GlassCard from "./xp-ui/GlassCard"; // Adjust path if your GlassCard is in a different location

const initialFormData = {
  bookName: "",
  authorName: "",
  isbn: "",
  quantity: 1,
  additionalNotes: ""
};

export default function BookFormComponent({ onFormSubmitSuccess }) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Please login to submit a request");
        // navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/request/book",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
          // validateStatus removed
        }
      );

      // If we reach here, Axios considered the response successful (status 2xx)
      // While Axios default is 2xx, explicit check can be good practice if needed,
      // but for standard REST success (200/201), the try block completing is enough.
      // Let's check for 200/201 explicitly for clarity based on your backend service
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data || "Request submitted successfully"); // Use the imported toast function
        setFormData(initialFormData); // Reset form data to initial state
        onFormSubmitSuccess(); // Call the callback function on success
      } else {
        toast.error(`Unexpected response status: ${response.status}`); // Use the imported toast function
        console.error("Unexpected successful response:", response);
      }


    } catch (error) {
      console.error("Full error object:", error); // Log the full error

      // Error handling for non-2xx responses (including 403, 400, 500 etc.)
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message // Try to get message from backend response body
        || error.response?.data // Fallback to full response data if message field doesn't exist
        || error.message // Fallback to Axios/network error message
        || "Failed to submit request"; // Default fallback

      if (status === 403) {
        toast.error("Authentication failed - please login again"); // Use the imported toast function
        localStorage.removeItem("authToken");
        // navigate("/login");
      } else if (status) {
        toast.error(`Error ${status}: ${errorMessage}`); // Use the imported toast function
      }
      else {
        toast.error(errorMessage); // Use the imported toast function
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="max-w-2xl mx-auto p-8 mb-8"> {/* Added mb-8 for spacing from RecentBookRequests */}
      <h2 className="text-2xl font-bold mb-6 text-center">Request a Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bookName">Book Title *</Label>
            <Input
              id="bookName"
              value={formData.bookName}
              onChange={(e) => setFormData({ ...formData, bookName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorName">Author *</Label>
            <Input
              id="authorName"
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            value={formData.additionalNotes}
            onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
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
  );
}