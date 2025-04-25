import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Import Loader2 icon

import GlassCard from "./xp-ui/GlassCard";

const initialFormData = {
  bookName: "",
  authorName: "",
  isbn: "",
  quantity: 1,
  additionalNotes: ""
};

export default function BookRequestForm({ onFormSubmitSuccess }) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({}); // State for field-specific errors
  const [generalError, setGeneralError] = useState(""); // State for general API errors

  const navigate = useNavigate();

  // Client-side validation function
  const validateForm = () => {
      const errors = {};
      if (!formData.bookName.trim()) {
          errors.bookName = "Book title is required.";
      }
      if (!formData.authorName.trim()) {
          errors.authorName = "Author is required.";
      }
      if (formData.quantity < 1) {
          errors.quantity = "Quantity must be at least 1.";
      }
      // Optional: Add ISBN format validation if needed (can be complex)
      // if (formData.isbn && !isValidISBN(formData.isbn)) {
      //     errors.isbn = "Invalid ISBN format.";
      // }
      // Optional: Add max length checks
      // if (formData.additionalNotes.length > 500) {
      //      errors.additionalNotes = "Notes cannot exceed 500 characters.";
      // }

      setFieldErrors(errors);
      return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    // Clear the specific field error when the user starts typing in that field
    if (fieldErrors[id]) {
        setFieldErrors(prev => ({ ...prev, [id]: "" }));
    }
    // Clear general error message when user starts typing in any field
    setGeneralError("");
    // Clear toast messages related to previous errors if possible (toast doesn't have a clear all API typically)
  };

   const handleQuantityChange = (e) => {
       const value = parseInt(e.target.value, 10);
       // Handle NaN case if input is cleared or non-numeric typed
       const quantityValue = isNaN(value) || value < 1 ? 1 : value;
       setFormData({ ...formData, quantity: quantityValue });
       // Clear quantity error
       if (fieldErrors.quantity) {
           setFieldErrors(prev => ({ ...prev, quantity: "" }));
       }
       setGeneralError("");
   }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(""); // Clear general error on new submit attempt
    setFieldErrors({}); // Clear all field errors on new submit attempt

    // Client-side validation
    if (!validateForm()) {
        setGeneralError("Please fix the errors in the form.");
        // Errors are already set in fieldErrors state by validateForm
        return; // Stop submission
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        // Use toast for this as it's an action required from the user outside the form
        toast.error("Please login to submit a request");
        // Optionally redirect, but maybe better handled by a wrapper or context
        // navigate("/login");
        return; // Stop submission
      }

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

      // Success handling (Axios throws for non-2xx, so if we're here, it's 2xx)
      // Check for 200/201 explicitly if backend is strict, otherwise try is enough
      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data?.message || response.data || "Request submitted successfully!");
        setFormData(initialFormData); // Reset form
        onFormSubmitSuccess(); // Trigger refresh in the list component
      } else {
         // This case is less likely with standard Axios but good as a safeguard
         setGeneralError(`Unexpected response status: ${response.status}`);
         toast.error(`Unexpected response status: ${response.status}`);
         console.error("Unexpected successful response:", response);
      }


    } catch (error) {
      console.error("Full error object:", error); // Log the full error

      const status = error.response?.status;
      const backendData = error.response?.data;

      // Attempt to extract a user-friendly message
      const errorMessage = backendData?.message // Check for a 'message' field
        || typeof backendData === 'string' ? backendData : "Failed to submit request."; // Fallback to data if string, or default

      if (status === 403) {
        setGeneralError("Authentication failed. Please log in again."); // General error display
        toast.error("Authentication failed - please login again"); // Toast notification
        localStorage.removeItem("authToken");
        // Consider navigating to login here if not handled by a global interceptor or route protection
      } else if (status) {
        // Handle other API errors
        setGeneralError(`Error ${status}: ${errorMessage}`);
        toast.error(`Error ${status}: ${errorMessage}`);
      }
      else {
         // Handle network errors etc.
        setGeneralError(errorMessage);
        toast.error(errorMessage);
      }

      // Optional: Try to map backend validation errors to field errors
      // This depends heavily on your backend's error response structure
      // Example: if backendData.errors is an array like [{ field: 'bookName', message: '...' }]
      // if (backendData?.errors && Array.isArray(backendData.errors)) {
      //     const newFieldErrors = {};
      //     backendData.errors.forEach(err => {
      //         if (err.field) {
      //             newFieldErrors[err.field] = err.message;
      //         }
      //     });
      //     setFieldErrors(newFieldErrors);
      // }


    } finally {
      setLoading(false);
    }
  };

  // Function to apply error classes
  const getInputClass = (fieldName) => {
      return `bg-white/10 dark:bg-black/20 border text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus-visible:ring-purple-500 focus-visible:border-purple-500 ${
          fieldErrors[fieldName] ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : 'border-white/20 dark:border-black/20'
      }`;
  }


  return (
    <GlassCard className="max-w-2xl mx-auto p-8 mb-8"> {/* Added mb-8 for spacing */}
      <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Request a Book</h2>
      <form onSubmit={handleSubmit} className="space-y-5"> {/* Increased vertical spacing */}

        {/* Display general API error */}
        {generalError && (
            <Alert variant="destructive">
              <AlertTitle>Submission Failed</AlertTitle>
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Book Title */}
          <div className="space-y-2">
            <Label htmlFor="bookName">Book Title <span className="text-red-500">*</span></Label> {/* Required indicator */}
            <Input
              id="bookName"
              value={formData.bookName}
              onChange={handleChange}
              required // HTML validation fallback
              className={getInputClass('bookName')} // Apply dynamic class
              aria-required="true" // ARIA attribute for accessibility
            />
            {fieldErrors.bookName && <p className="text-sm text-red-500 mt-1">{fieldErrors.bookName}</p>}
          </div>
          {/* Author Name */}
          <div className="space-y-2">
            <Label htmlFor="authorName">Author <span className="text-red-500">*</span></Label> {/* Required indicator */}
            <Input
              id="authorName"
              value={formData.authorName}
              onChange={handleChange}
              required // HTML validation fallback
              className={getInputClass('authorName')} // Apply dynamic class
              aria-required="true" // ARIA attribute
            />
             {fieldErrors.authorName && <p className="text-sm text-red-500 mt-1">{fieldErrors.authorName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ISBN */}
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="e.g. 978-3-16-148410-0"
              className={getInputClass('isbn')}
            />
             {fieldErrors.isbn && <p className="text-sm text-red-500 mt-1">{fieldErrors.isbn}</p>}
          </div>
          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleQuantityChange} // Use specific handler for number input
              className={getInputClass('quantity')}
            />
             {fieldErrors.quantity && <p className="text-sm text-red-500 mt-1">{fieldErrors.quantity}</p>}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows={3}
            placeholder="Any specific edition, condition, or details..." // Add placeholder
            className={getInputClass('additionalNotes')}
          />
           {fieldErrors.additionalNotes && <p className="text-sm text-red-500 mt-1">{fieldErrors.additionalNotes}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button" // Important: type="button" to prevent form submission
            variant="outline" // Ensure variant styling matches your theme
            onClick={() => navigate(-1)}
            disabled={loading} // Disable while submitting
            className="border-white/20 dark:border-black/20 text-black dark:text-white hover:bg-purple-400/70 hover:text-white dark:hover:bg-purple-500 dark:hover:text-white" // Apply custom styles
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading} // Disable while submitting
            className="bg-black/90 dark:bg-white/90 text-white dark:text-black hover:bg-purple-400/70 hover:text-black dark:hover:bg-purple-500 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" // Apply custom styles
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}