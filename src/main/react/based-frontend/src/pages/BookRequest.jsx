// TODO: DEPRECATE AND REMOVE
import { useState } from "react";
import axios from "axios";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FloatingIconsBackground from "../components/xp-ui/FloatingiconsBackground";
import GlassCard from "../components/xp-ui/GlassCard";
import { Label } from "@/components/ui/label"; // Importing Label

export default function BookRequest() {
  const [formData, setFormData] = useState({
    bookName: "",
    authorName: "",
    isbn: "",
    quantity: 1, // Default value set to 1
    requesterName: "",
    requesterEmail: "",
    additionalNotes: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8080/api/book/request", formData);
      setMessage(`✅ ${response.data}`);
      setFormData({
        bookName: "",
        authorName: "",
        isbn: "",
        quantity: 1, // Reset to default value after successful submission
        requesterName: "",
        requesterEmail: "",
        additionalNotes: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to submit book request. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-white/90 dark:bg-black/90 text-black dark:text-white transition-colors duration-300">
      {/* Background covering entire page */}
      <div className="absolute inset-0 z-0">
        <FloatingIconsBackground />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-xl">
        <GlassCard className="w-full max-w-md backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Request a Book</CardTitle>
          </CardHeader>

          <CardContent>
            {message && (
              <Alert variant="success" className="mb-4">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "bookName", label: "Book Name", type: "text" },
                { name: "authorName", label: "Author Name", type: "text" },
                { name: "isbn", label: "ISBN", type: "text" },
                { name: "quantity", label: "Quantity", type: "number" },
                { name: "requesterName", label: "Your Name", type: "text" },
                { name: "requesterEmail", label: "Your Email", type: "email" },
                { name: "additionalNotes", label: "Additional Notes", type: "text" },
              ].map((field) => (
                <div key={field.name} className="space-y-1">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    {...field}
                    autoComplete="off"
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={
                      field.name !== "quantity" && field.name !== "additionalNotes"
                    }
                    className="bg-white/10 dark:bg-black/20 border border-white/20 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50"
                  />
                </div>
              ))}

              <div className="flex gap-4 mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black/90 dark:bg-white/90 backdrop-blur-md border border-white/30 text-white dark:text-black uppercase tracking-wide hover:bg-purple-400/70 hover:text-black dark:hover:bg-purple-500 dark:hover:text-white transition-all duration-200"
              >
                {loading ? "Submitting..." : "Request Book"}
              </Button>


                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/30 text-black dark:text-white uppercase tracking-wide hover:bg-purple-400/70 hover:text-white transition-all duration-200"
                  onClick={() => window.location.href = '/'}
                >
                  Go Home
                </Button>
              </div>
            </form>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
