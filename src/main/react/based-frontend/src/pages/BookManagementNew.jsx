import BookForm from "../components/BookForm";
import BookSearch from "../components/BookSearchNew";
import FloatingIconsBackground from "../components/xp-ui/FloatingiconsBackground";

function BookManagementNew() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white-100 dark:bg-gray-900 py-8">

      {/* Background covering entire page */}
      <div className="absolute inset-0 z-0">
        <FloatingIconsBackground />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">
        {/* <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          📚 Book Management
        </h1> */}

        {/* <BookForm /> */}
        <BookSearch />
      </div>

    </div>
  );
}

export default BookManagementNew;
