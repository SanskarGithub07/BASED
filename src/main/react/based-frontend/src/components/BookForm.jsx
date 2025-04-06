import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function BookForm() {
  const [book, setBook] = useState({
    isbn: "",
    authorName: "",
    bookName: "",
    price: "",
    quantity: "",
    publicationYear: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/book/add", book);
      setMessage("✅ Book added successfully!");
      setBook({
        isbn: "",
        authorName: "",
        bookName: "",
        price: "",
        quantity: "",
        publicationYear: ""
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add book. Please check your input.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Add Book</CardTitle>
        </CardHeader>

        <CardContent>
          {message && (
            <p className="mb-4 text-center text-sm text-blue-700">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                autoComplete="off"
                name="isbn"
                type="number"
                placeholder="ISBN"
                value={book.isbn}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="authorName">Author Name</Label>
              <Input
                autoComplete="off"
                name="authorName"
                type="text"
                placeholder="Author"
                value={book.authorName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="bookName">Book Name</Label>
              <Input
                autoComplete="off"
                name="bookName"
                type="text"
                placeholder="Book Name"
                value={book.bookName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                autoComplete="off"
                name="price"
                type="number"
                step="0.01"
                placeholder="Price"
                value={book.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                autoComplete="off"
                name="quantity"
                type="number"
                placeholder="Quantity"
                value={book.quantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="publicationYear">Publication Year</Label>
              <Input
                autoComplete="off"
                name="publicationYear"
                type="date"
                value={book.publicationYear}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full">
              Add Book
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
