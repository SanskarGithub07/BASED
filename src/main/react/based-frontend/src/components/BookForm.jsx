import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

// from experimental ui
import FloatingIconsBackground from "./xp-ui/FloatingiconsBackground";
import GlassCard from "./xp-ui/GlassCard";

export default function BookForm() {
  const [book, setBook] = useState({
    isbn: "",
    authorName: "",
    bookName: "",
    price: "",
    quantity: "",
    publicationYear: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:8080/api/book/add", book);
      setMessage("✅ Book added successfully!");

      setBook({
        isbn: "",
        authorName: "",
        bookName: "",
        price: "",
        quantity: "",
        publicationYear: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add book. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden bg-gray-100 px-4">
      {/* <FloatingIconsBackground /> */}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-xl"
      >
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Add Book</CardTitle>
          </CardHeader>

          <CardContent>
            {message && (
              <Alert
                variant={message.includes("successfully") ? "success" : "destructive"}
                className="mb-4"
              >
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "isbn", label: "ISBN", type: "number" },
                { name: "authorName", label: "Author Name", type: "text" },
                { name: "bookName", label: "Book Name", type: "text" },
                { name: "price", label: "Price", type: "number", step: "0.01" },
                { name: "quantity", label: "Quantity", type: "number" },
                { name: "publicationYear", label: "Publication Year", type: "date" },
              ].map((field) => (
                <div key={field.name} className="space-y-1">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    {...field}
                    autoComplete="off"
                    value={book[field.name]}
                    onChange={handleChange}
                    required={field.name !== "price" && field.name !== "quantity"}
                  />
                </div>
              ))}

            <div className="flex gap-4 mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black/90 backdrop-blur-md border border-white/30 text-white uppercase tracking-wide hover:bg-purple-400/70 hover:text-black transition-all duration-200"
              >
                {loading ? "Adding..." : "Add Book"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="flex-1 bg-black/90 backdrop-blur-md border border-white/30 text-white uppercase tracking-wide hover:bg-purple-400/70 hover:text-black transition-all duration-200"
                onClick={() => window.location.href = '/'}  // Pure redirect without next/router
              >
                Go Home
              </Button>
            </div>

            </form>
          </CardContent>
        </GlassCard>
      </motion.div>
    </div>
  );
}
