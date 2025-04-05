import { useState } from "react";
import axios from "axios";

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
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 my-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Add Book</h2>
            {message && <p className="mb-4 text-center text-sm text-blue-700">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    autoComplete="off"
                    name="isbn"
                    type="number"
                    placeholder="ISBN"
                    value={book.isbn}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                    autoComplete="off"
                    name="authorName"
                    type="text"
                    placeholder="Author"
                    value={book.authorName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                    autoComplete="off"
                    name="bookName"
                    type="text"
                    placeholder="Book Name"
                    value={book.bookName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                    autoComplete="off"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={book.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                    autoComplete="off"
                    name="quantity"
                    type="number"
                    placeholder="Quantity"
                    value={book.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                    autoComplete="off"
                    name="publicationYear"
                    type="date"
                    value={book.publicationYear}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Add Book
                </button>
            </form>
        </div>
    );
}
