import { useEffect, useState } from "react";
import axios from "axios";

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/book/filtering&pagination&sorting", {
        params: {
          author: "Sandra Levy Ceren",
        },
      })
      .then((response) => {
      console.log(response.data)
        setBooks(response.data.content); // adjust as per backend response
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  return (
    <div>
      <h2>Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.bookName} by {book.authorName}</li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;
