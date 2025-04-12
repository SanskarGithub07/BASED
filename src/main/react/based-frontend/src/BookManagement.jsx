import BookForm from "./components/BookForm";
import BookSearch from "./components/BookSearch";
import BookList from "./components/BookList";

function BookManagement() {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">📚 Book Management</h1>
            <BookForm />
            <BookSearch />

            <BookList />
        </div>
    );
}

export default BookManagement;
