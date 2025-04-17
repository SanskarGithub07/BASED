import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
const DEFAULT_BOOK_IMAGE = "/placeholder.jpeg";
const MIN_IMAGE_DIMENSION = 10;

export default function BookGrid() {
  const [filters, setFilters] = useState({
    "author-name": "",
    "isbn-number": "",
    "book-name": "",
    "min-price": 0,
    "max-price": 5000,
    availability: "IN_STOCK",
    "publication-year": null,
    publisher: "",
    page: 0,
    size: 6,
    sort: '[{"field":"price","direction":"desc"}]', 
  });

  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      // Create a clean params object
      const params = {};
      
      // Only add parameters that have values
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          // Special handling for sort parameter
          if (key === "sort") {
            // Send sort as a properly formatted string without encoding it manually
            params[key] = encodeURIComponent(value);
          } else {
            params[key] = value;
          }
        }
      });
      const token = localStorage.getItem("authToken");
      // Use axios to make the request with properly structured params
      const res = await axios.get("http://localhost:8080/api/book/filtering&pagination&sorting", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.content) {
        console.log(res.data.content);
        setBooks(res.data.content);
        setTotalPages(res.data.totalPages || 0);
      } else {
        console.warn("No content in response:", res.data);
        setBooks([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters.page]); // This will re-fetch when page changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSlider = ([min, max]) => {
    setFilters(prev => ({ ...prev, "min-price": min, "max-price": max }));
  };

  const handleApplyFilter = () => {
    // Reset to first page when applying new filters
    setFilters(prev => ({ ...prev, page: 0 }));
    fetchBooks();
  };
  const handleImageError = useCallback((event) => {
    event.target.src = DEFAULT_BOOK_IMAGE;
    event.target.onerror = null; // Prevent infinite loops if the default image also fails
  }, []);

  const handleImageLoad = useCallback(async (event) => {
    const img = event.target;
    if (!isValidImageDimension(img.naturalWidth, img.naturalHeight)) {
      img.src = DEFAULT_BOOK_IMAGE;
    }
  }, []);

  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 30; i++) {
    yearOptions.push(currentYear - i);
  }
  const isValidImageDimension = (width, height) => {
    return width > MIN_IMAGE_DIMENSION && height > MIN_IMAGE_DIMENSION;
  };
  const validateImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(isValidImageDimension(img.width, img.height));
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = url;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      {/* Filter Sidebar */}
      <div className="col-span-1 space-y-4">
        <h2 className="font-bold text-lg">Filters</h2>
        
        <Input
          placeholder="Author Name"
          name="author-name"
          value={filters["author-name"]}
          onChange={handleChange}
        />
        
        <Input
          placeholder="Book Name"
          name="book-name"
          value={filters["book-name"]}
          onChange={handleChange}
        />
        
        <Input
          placeholder="ISBN"
          name="isbn-number"
          value={filters["isbn-number"]}
          onChange={handleChange}
        />

        <Input
          placeholder="Publisher"
          name="publisher"
          value={filters.publisher}
          onChange={handleChange}
        />

        <div className="space-y-2">
          <label className="text-sm">Publication Year</label>
          <Select
            value={filters["publication-year"] || "ANY"}
            onValueChange={(v) =>
              setFilters(prev => ({ ...prev, "publication-year": v === "ANY" ? null : v }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ANY">Any Year</SelectItem>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Price Range: ₹{filters["min-price"]} - ₹{filters["max-price"]}</label>
          <Slider
            defaultValue={[filters["min-price"], filters["max-price"]]}
            value={[filters["min-price"], filters["max-price"]]}
            min={0}
            max={5000}
            step={50}
            onValueChange={handleSlider}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Availability</label>
          <RadioGroup
            value={filters.availability}
            onValueChange={(v) => setFilters(prev => ({ ...prev, availability: v }))}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="IN_STOCK" id="in-stock" />
              <label htmlFor="in-stock">In Stock</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="OUT_OF_STOCK" id="out-of-stock" />
              <label htmlFor="out-of-stock">Out of Stock</label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Sort By</label>
          <Select
            value={filters.sort}
            onValueChange={(v) => setFilters(prev => ({ ...prev, sort: v }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='[{"field":"price","direction":"desc"}]'>Price High to Low</SelectItem>
              <SelectItem value='[{"field":"price","direction":"asc"}]'>Price Low to High</SelectItem>
              <SelectItem value='[{"field":"bookName","direction":"asc"}]'>Name A-Z</SelectItem>
              <SelectItem value='[{"field":"bookName","direction":"desc"}]'>Name Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleApplyFilter}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Loading..." : "Apply Filters"}
        </Button>
      </div>

      {/* Book Cards */}
      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <p>Loading books...</p>
          </div>
        ) : books.length > 0 ? (
          books.map((book) => (
            <Card key={book.id} className="hover:shadow-xl transition duration-200">
              <CardHeader>
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src={book.imageUrl || DEFAULT_BOOK_IMAGE}
                      alt={book.bookName}
                      className="rounded-xl cursor-pointer h-48 w-full object-cover"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <img
                          src={book.imageUrl || DEFAULT_BOOK_IMAGE}
                          alt={book.bookName}
                          className="rounded-xl w-full object-cover"
                          onError={handleImageError}
                          onLoad={handleImageLoad}
                        />
                      </div>
                      <div className="col-span-2">
                        <h2 className="text-xl font-bold mb-2">{book.bookName}</h2>
                        <p><strong>Author:</strong> {book.authorName}</p>
                        <p><strong>ISBN:</strong> {book.isbn}</p>
                        <p><strong>Publisher:</strong> {book.publisher}</p>
                        <p><strong>Price:</strong> ₹{book.price}</p>
                        <p><strong>Available:</strong> {book.availability === "IN_STOCK" ? "Yes" : "No"}</p>
                        <p><strong>Published:</strong> {book.publicationYear}</p>
                        <div className="mt-4">
                          <p><strong>Description:</strong></p>
                          <p className="text-sm mt-1">
                            {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="mt-4"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("authToken"); // Assuming you store your token in localStorage
                          console.log(token);
                          const payload = {
                            bookIsbn: book.isbn,
                            quantity: 1, // You can make this dynamic later
                          };

                          await axios.post("http://localhost:8080/api/cart/add", payload, {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          });

                          alert("Book added to cart!");
                        } catch (error) {
                          console.error("Error adding to cart:", error);
                          alert("Failed to add book to cart.");
                        }
                      }}
                    >
                      🛒 Add to Cart
                    </Button>

                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-md font-semibold truncate">
                  {book.bookName}
                </CardTitle>
                <p className="text-sm text-muted-foreground truncate">{book.authorName}</p>
                <p className="text-sm font-bold">₹{book.price}</p>
                <p className="text-xs">{book.availability === "IN_STOCK" ? "In Stock" : "Out of Stock"}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-64">
            <p className="text-muted-foreground">No books found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {books.length > 0 && (
        <div className="col-span-full flex justify-center mt-6 gap-4">
          <Button
            disabled={filters.page === 0 || loading}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <span className="flex items-center">
            Page {filters.page + 1} of {Math.max(1, totalPages)}
          </span>
          <Button
            disabled={filters.page + 1 >= totalPages || loading}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}