import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { X } from "lucide-react";

export default function BookSearch() {
  const [searchParams, setSearchParams] = useState({
    isbn: "",
    authorName: "",
    bookName: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    const queryParams = new URLSearchParams();
    if (searchParams.authorName) queryParams.append("author", searchParams.authorName);
    if (searchParams.isbn) queryParams.append("isbn", searchParams.isbn);
    if (searchParams.bookName) queryParams.append("name", searchParams.bookName);

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/book/search?${queryParams}`);
      setResults(response.data);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchParams({ isbn: "", authorName: "", bookName: "" });
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto my-10">
      <Card className="md:col-span-1 p-4 border border-gray-200 shadow-sm sticky top-4 h-fit">
        <CardHeader>
          <CardTitle className="font-semibold text-sm tracking-wide text-gray-700 uppercase">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-gray-600">Apply filters below</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleClearFilters}>
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear filters</TooltipContent>
            </Tooltip>
          </div>
          <Input ref={inputRef} name="isbn" placeholder="ISBN" value={searchParams.isbn} onChange={handleChange} onKeyDown={handleKeyDown} />
          <Input name="authorName" placeholder="Author Name" value={searchParams.authorName} onChange={handleChange} onKeyDown={handleKeyDown} />
          <Input name="bookName" placeholder="Book Name" value={searchParams.bookName} onChange={handleChange} onKeyDown={handleKeyDown} />
          <Button onClick={handleSearch} className="w-full" disabled={loading}>{loading ? "Searching..." : "Search"}</Button>
        </CardContent>
      </Card>

      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <Separator />
          <ScrollArea className="h-[600px] p-4">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                {/* <img src="/empty-state.svg" className="w-40 mb-4" /> */}
                <p>No books found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((book, index) => (
                  <Card key={index} className="flex flex-col justify-between p-4 border border-gray-200 shadow-sm hover:shadow-md transition">
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{book.bookName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <p className="text-gray-600">{book.authorName}</p>
                      <p className="text-gray-400 text-xs">ISBN: {book.isbn}</p>
                      <p className="font-semibold text-green-600">₹{book.price}</p>
                      <Button size="sm" className="w-full mt-2">View Details</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
