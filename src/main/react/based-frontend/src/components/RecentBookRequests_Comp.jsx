import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Import Alert components
import { ChevronDownIcon, ChevronUpIcon, Loader2 } from "lucide-react"; // Import icons
import { motion, AnimatePresence } from "framer-motion";

// Define initial fetch limit and display limit
const INITIAL_FETCH_LIMIT = 10; // Fetch more initially, but display less
const INITIAL_DISPLAY_LIMIT = 5; // How many to show by default

export default function RecentBookRequests({ refreshKey }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLimit, setFetchLimit] = useState(INITIAL_FETCH_LIMIT); // How many to ask the backend for
  const [displayLimit, setDisplayLimit] = useState(INITIAL_DISPLAY_LIMIT); // How many to actually display from the fetched list
  // Note: The current backend returns `last` based on the `limit`.
  // True pagination (offset/limit or page/size) is more scalable if available.
  // This implementation fetches *up to fetchLimit* items and *displays up to displayLimit*.
  // "Show More" only increases displayLimit. The Select changes fetchLimit and resets displayLimit.

  const [fetchError, setFetchError] = useState(""); // State for fetch errors
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Effect to fetch requests when fetchLimit or refreshKey changes
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setFetchError(""); // Clear previous fetch error

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
            // Handle case where token is missing - user might not be logged in
            setFetchError("Authentication required to view requests.");
            setRequests([]); // Clear previous requests
            setLoading(false);
            return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/request/user/recent?limit=${fetchLimit}`, // Use fetchLimit for backend request
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data && Array.isArray(response.data.content)) {
          setRequests(response.data.content);
          // Note: response.data.last only tells us if this *specific fetch* was the last page.
          // For simple "Show More" that just reveals more from a larger fetch, `hasMore` based on backend `last` is less useful.
          // We will determine if "Show More" should appear based on whether there are more items fetched than currently displayed.
        } else {
          // Handle unexpected response format
          console.error("Unexpected response format:", response.data);
          setRequests([]);
          setFetchError("Received unexpected data format from the server.");
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        setRequests([]); // Clear requests on error

        const status = error.response?.status;
         const backendData = error.response?.data;
         const errorMessage = backendData?.message // Check for a 'message' field
           || typeof backendData === 'string' ? backendData : "Failed to load recent requests."; // Fallback

        if (status === 403) {
          setFetchError("Authentication failed. Please log in again.");
           localStorage.removeItem("authToken");
           // Consider redirecting to login here if not handled globally
        } else if (status) {
          setFetchError(`Error ${status}: ${errorMessage}`);
        } else {
          setFetchError(errorMessage); // Network or other error
        }

      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [fetchLimit, refreshKey]); // Dependencies: Re-fetch if fetchLimit changes or refreshKey is incremented

  // Function to handle showing more requests
  // This now increases the *displayLimit*, not the backend fetch limit
  const handleShowMore = () => {
      // Increase display limit by a fixed amount (e.g., INITIAL_DISPLAY_LIMIT)
      setDisplayLimit(prevLimit => prevLimit + INITIAL_DISPLAY_LIMIT);
  };

  // Function to handle changing the fetch/display limit via the Select
  const handleLimitChange = (newFetchLimitString) => {
    const newFetchLimit = parseInt(newFetchLimitString, 10);
    setFetchLimit(newFetchLimit); // Update fetch limit, triggers useEffect
    setDisplayLimit(newFetchLimit); // Also reset display limit to the new fetch limit
    // No need to clear requests/hasMore/set loading here, useEffect will handle it
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Determine which requests to display based on displayLimit
  const displayedRequests = requests.slice(0, displayLimit);

  // Determine if the "Show More" button should be visible
  const showMoreButtonVisible = requests.length > displayLimit && !loading;


  const collapseVariants = {
    open: {
      maxHeight: "1000px", // Use a reasonable large value
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }, // Slightly longer duration
    },
    collapsed: {
      maxHeight: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
      overflow: "hidden"
    },
  };

  return (
    <div className="mt-12">
      {/* Header with Collapse Toggle and Limit Select */}
      {/* Made the whole flex container clickable for collapse */}
      <div
        className="flex justify-between items-center mb-4 cursor-pointer group" // Added group class for hover effects
        onClick={toggleCollapse} // Click handler on the container
      >
        <h3 className="text-lg font-semibold text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"> {/* Added hover effect */}
          Your Recent Requests
        </h3>
        <div className="flex items-center space-x-2">
          {/* Limit Select - Not part of the collapse toggle click area */}
           <div onClick={(e) => e.stopPropagation()} className="flex items-center space-x-2"> {/* Stop click event propagation */}
             <Label htmlFor="request-limit" className="text-sm text-black dark:text-white">Show:</Label>
             <Select onValueChange={handleLimitChange} value={String(fetchLimit)}> {/* Bind to fetchLimit */}
               <SelectTrigger id="request-limit" className="w-[80px] sm:w-[100px] text-sm bg-white/10 dark:bg-black/20 border border-white/20 text-black dark:text-white">
                 <SelectValue placeholder={`${fetchLimit} requests`} /> {/* Use fetchLimit for placeholder */}
               </SelectTrigger>
               <SelectContent className="bg-white/90 dark:bg-black/90 border border-white/20 backdrop-blur-md">
                 <SelectItem value="3">3</SelectItem>
                 <SelectItem value="5">5</SelectItem>
                 <SelectItem value="10">10</SelectItem>
                 <SelectItem value="20">20</SelectItem>
                 <SelectItem value="50">50</SelectItem> {/* Added more options */}
               </SelectContent>
             </Select>
           </div>
           {/* Chevron Icon - Visual indicator for collapse state */}
           <Button variant="ghost" size="icon" className="p-0 h-auto w-auto group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"> {/* Added hover effect */}
             {isCollapsed ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
           </Button>
        </div>
      </div>

      {/* Collapsible Content Area */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            className="collapsible-wrapper"
            variants={collapseVariants}
            initial="collapsed"
            animate="open"
            exit="collapsed"
          >
            {/* Display Fetch Error */}
             {fetchError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Failed to Load Requests</AlertTitle>
                  <AlertDescription>{fetchError}</AlertDescription>
                </Alert>
             )}

            {/* Loading Indicator */}
            {loading && requests.length === 0 ? ( // Only show spinner if initially loading and no data
              <div className="flex justify-center py-8 text-black/70 dark:text-white/70">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading requests...
              </div>
            ) : displayedRequests.length === 0 && !loading && !fetchError ? ( // Show empty state only if no requests, not loading, and no fetch error
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg"> {/* Added border for visual emphasis */}
                <p className="text-base font-medium">No recent requests found.</p>
                <p className="text-sm mt-1">Use the form above to submit your first request.</p>
              </div>
            ) : (
              // List of Requests
              <div className="space-y-4"> {/* Increased vertical spacing */}
                {displayedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border rounded-lg dark:border-gray-700 bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-200" // Applied glass card styles
                  >
                    <div className="flex justify-between items-start gap-4"> {/* Added gap */}
                      <div className="flex-1"> {/* Allow title/author to take space */}
                        <h4 className="font-medium text-black dark:text-white">{request.bookName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {request.authorName} {request.isbn ? `• ${request.isbn}` : ''} {/* Conditionally display ISBN */}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full min-w-[80px] text-center whitespace-nowrap ${ // Fixed width for status
                        request.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                          : request.status === 'ADDED'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    {request.additionalNotes && (
                      <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-3"> {/* Separator */}
                        <span className="font-medium">Notes:</span> {request.additionalNotes}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Requested on: {new Date(request.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })} {/* Improved date format */}
                    </p>
                  </div>
                ))}
                 {/* "Show More" Button */}
                {showMoreButtonVisible && (
                  <div className="flex justify-center pt-4"> {/* Add padding top */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShowMore}
                      disabled={loading} // Disable while loading
                      className="text-black/70 dark:text-white/70 hover:bg-purple-400/20 dark:hover:bg-purple-500/20"
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Show More ({requests.length - displayLimit} hidden) {/* Indicate how many more */}
                    </Button>
                  </div>
                )}
                 {/* Message when all fetched requests are displayed */}
                 {requests.length > 0 && requests.length <= displayLimit && !loading && fetchLimit <= requests.length && (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                       Showing all {requests.length} requested items.
                    </div>
                 )}
                 {/* Message if loading more after clicking show more - need to adjust state */}
                 {loading && requests.length > 0 && ( // Check if loading *after* initial load
                    <div className="flex justify-center py-4 text-black/70 dark:text-white/70 text-sm">
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading more...
                    </div>
                 )}

              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}