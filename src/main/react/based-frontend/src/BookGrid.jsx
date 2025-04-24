import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import GlassCard from "./components/xp-ui/GlassCard";
import FloatingIconsBackground from "./components/xp-ui/FloatingiconsBackground";

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
    <div className="relative min-h-screen overflow-hidden bg-white-100 dark:bg-gray-900 py-8">
      {/* Background covering entire page */}
      <div className="absolute inset-0 z-0">
        <FloatingIconsBackground />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className="col-span-1">
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">Filters</h2>
              
              <div className="space-y-4">
                <input
                  placeholder="Author Name"
                  name="author-name"
                  value={filters["author-name"]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg bg-white/10 backdrop-blur-sm"
                />
                
                <input
                  placeholder="Book Name"
                  name="book-name"
                  value={filters["book-name"]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg bg-white/10 backdrop-blur-sm"
                />
                
                <input
                  placeholder="ISBN"
                  name="isbn-number"
                  value={filters["isbn-number"]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg bg-white/10 backdrop-blur-sm"
                />

                <input
                  placeholder="Publisher"
                  name="publisher"
                  value={filters.publisher}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg bg-white/10 backdrop-blur-sm"
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Publication Year</label>
                  <Select
                    value={filters["publication-year"] || "ANY"}
                    onValueChange={(v) =>
                      setFilters(prev => ({ ...prev, "publication-year": v === "ANY" ? null : v }))
                    }
                  >
                    <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border rounded-lg">
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
                  <label className="text-sm font-medium">Price Range: ₹{filters["min-price"]} - ₹{filters["max-price"]}</label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[filters["min-price"], filters["max-price"]]}
                      value={[filters["min-price"], filters["max-price"]]}
                      min={0}
                      max={5000}
                      step={50}
                      onValueChange={handleSlider}
                      className="py-4"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Availability</label>
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
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={filters.sort}
                    onValueChange={(v) => setFilters(prev => ({ ...prev, sort: v }))}
                  >
                    <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border rounded-lg">
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

                <button
                  onClick={handleApplyFilter}
                  disabled={loading}
                  className="w-full bg-black text-white py-2 rounded-lg backdrop-blur-md border border-white/30 text-white uppercase tracking-wide hover:bg-purple-400/70 hover:text-black transition-all duration-200"
                >
                  {loading ? "Loading..." : "Apply Filters"}
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Book Cards */}
          <div className="lg:col-span-3">
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-center">Books Collection</h2>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-lg opacity-70">Loading books...</p>
                </div>
              ) : books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <GlassCard key={book.id} className="p-4 hover:shadow-xl transition duration-200">
                      <Dialog>
                        <DialogTrigger asChild>
                          <img
                            src={book.imageUrl || DEFAULT_BOOK_IMAGE}
                            alt={book.bookName}
                            className="rounded-xl cursor-pointer h-48 w-full object-cover mb-4 hover:shadow-lg transition-all duration-300"
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                          />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-gradient-to-br from-white/80 to-purple-50/90 backdrop-blur-md border border-purple-200 rounded-xl shadow-xl dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-purple-600 dark:text-white">
                          <div className="relative">
                            
                            {/* Book detail content with improved styling */}
                            <div className="grid grid-cols-3 gap-6 pt-4">
                              <div className="col-span-1">
                                <div className="rounded-xl overflow-hidden shadow-lg border border-purple-100 dark:border-purple-500">
                                  <img
                                    src={book.imageUrl || DEFAULT_BOOK_IMAGE}
                                    alt={book.bookName}
                                    className="w-full object-cover"
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                  />
                                </div>
                              </div>
                              <div className="col-span-2">
                                <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">{book.bookName}</h2>
                                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                  <p className="flex items-center">
                                    <span className="font-medium w-24 dark:text-gray-400">Author:</span> 
                                    <span className="text-gray-800 dark:text-gray-200">{book.authorName}</span>
                                  </p>
                                  <p className="flex items-center">
                                    <span className="font-medium w-24 dark:text-gray-400">ISBN:</span> 
                                    <span className="text-gray-800 dark:text-gray-200">{book.isbn}</span>
                                  </p>
                                  <p className="flex items-center">
                                    <span className="font-medium w-24 dark:text-gray-400">Publisher:</span> 
                                    <span className="text-gray-800 dark:text-gray-200">{book.publisher}</span>
                                  </p>
                                  <p className="flex items-center">
                                    <span className="font-medium w-24 dark:text-gray-400">Price:</span> 
                                    <span className="text-gray-800 font-medium dark:text-gray-200">₹{book.price}</span>
                                  </p>
                                  <p className="flex items-center">
                                    <span className="font-medium w-24 dark:text-gray-400">Available:</span> 
                                    <span className={book.availability === "IN_STOCK" ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                      {book.availability === "IN_STOCK" ? "Yes" : "No"}
                                    </span>
                                  </p>
                                  <p className="flex items-center">
                                    <span className="font-medium w-24 dark:text-gray-400">Published:</span> 
                                    <span className="text-gray-800 dark:text-gray-200">{book.publicationYear}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Description section with improved styling */}
                            <div className="mt-6 bg-white/50 p-4 rounded-lg border border-purple-100 dark:bg-gray-700 dark:border-purple-500">
                              <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Description:</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                              </p>
                            </div>
                            <DialogClose asChild>
                            <button
                              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg backdrop-blur-md border border-purple-400/30 font-medium tracking-wide hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem("authToken");
                                  console.log(token);
                                  const payload = {
                                    bookIsbn: book.isbn,
                                    quantity: 1,
                                  };
                                  await axios.post("http://localhost:8080/api/cart/add", payload, {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  });
                                  // alert("Book added to cart!");
                                  toast.success("Item Successfully Added")
                                } catch (error) {
                                  console.error("Error adding to cart:", error);
                                  toast.error("Failed to Add Item to the Cart")
                                }
                              }}
                            >
                            
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              ADD TO CART
                            </button>
                          </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <h3 className="text-md font-semibold truncate">{book.bookName}</h3>
                      <p className="text-sm opacity-70 truncate">{book.authorName}</p>
                      <p className="text-sm font-bold">₹{book.price}</p>
                      <p className="text-xs">{book.availability === "IN_STOCK" ? "In Stock" : "Out of Stock"}</p>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-lg opacity-70">No books found matching your criteria</p>
                </div>
              )}
              
              {/* Pagination */}
              {books.length > 0 && (
                <div className="flex justify-center mt-8 gap-4">
                  <button
                    disabled={filters.page === 0 || loading}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-purple-400/20 transition-all duration-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="flex items-center px-4">
                    Page {filters.page + 1} of {Math.max(1, totalPages)}
                  </span>
                  <button
                    disabled={filters.page + 1 >= totalPages || loading}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-purple-400/20 transition-all duration-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}