import BookForm from "../components/BookForm";
import BookSearch from "../components/BookSearch";
import FloatingIconsBackground from "../components/xp-ui/FloatingiconsBackground";

function BookManagement() {
    return (
        <div className="relative min-h-screen bg-gray-100 py-8 overflow-hidden">
            
            {/* Background covering entire page */}
            <div className="absolute inset-0 z-0">
                <FloatingIconsBackground />
            </div>

            {/* Foreground Content */}
            <div className="relative z-10">
                <h1 className="text-3xl font-bold text-center mb-8">
                    📚 Book Management
                </h1>

                <BookForm />
                <BookSearch />
            </div>

        </div>
    );
}

export default BookManagement;
