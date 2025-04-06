import { useState } from "react";
import axios from "axios";

export default function BookSearch() {
    const [searchParams, setSearchParams] = useState({
        isbn: "",
        authorName: "",
        bookName: ""
    });
    const [results, setResults] = useState([]);

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        const queryParams = new URLSearchParams();
        if (searchParams.authorName) queryParams.append("author", searchParams.authorName);
        if (searchParams.isbn) queryParams.append("isbn", searchParams.isbn);
        if (searchParams.bookName) queryParams.append("name", searchParams.bookName);

        try {
            const response = await axios.get(`http://localhost:8080/api/book/search?${queryParams}`);
            setResults(response.data);
        } catch (err) {
            console.error("Search failed:", err);
            setResults([]);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 my-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Search Books</h2>
            <div className="space-y-4">
                <input
                    autoComplete="off"
                    name="isbn"
                    type="text"
                    placeholder="ISBN"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                    autoComplete="off"
                    name="authorName"
                    type="text"
                    placeholder="Author"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                    autoComplete="off"
                    name="bookName"
                    type="text"
                    placeholder="Book Name"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <button
                    onClick={handleSearch}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                    Search
                </button>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Results</h3>
                {results.length === 0 ? (
                    <p className="text-gray-500 text-center">No books found.</p>
                ) : (
                    <ul className="space-y-3">
                        {results.map((book) => (
                            <li key={book.id} className="border rounded-md p-4 shadow-sm">
                                <p><span className="font-medium">Title:</span> {book.bookName}</p>
                                <p><span className="font-medium">Author:</span> {book.authorName}</p>
                                <p><span className="font-medium">ISBN:</span> {book.isbn}</p>
                                <p><span className="font-medium">Price:</span> ₹{book.price}</p>
                                <p><span className="font-medium">Quantity:</span> {book.quantity}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
