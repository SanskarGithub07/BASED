import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Adjust path if necessary
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentBookRequests({ refreshKey }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(3); // Backend limit
  const [displayLimit, setDisplayLimit] = useState(3); // User selected display limit
  const [hasMore, setHasMore] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:8080/api/request/user/recent?limit=${limit}`, // Your backend endpoint
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data && response.data.content) {
          setRequests(response.data.content);
          setHasMore(!response.data.last);
        } else {
          setRequests([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        setRequests([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [limit, refreshKey]); 

  const handleShowMore = () => {
    setLimit(prevLimit => prevLimit + 3);
  };

  const handleLimitChange = (newDisplayLimit) => {
    setDisplayLimit(parseInt(newDisplayLimit, 10));
    setLimit(parseInt(newDisplayLimit, 10)); 
    setRequests([]);
    setHasMore(true); 
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const displayedRequests = requests.slice(0, displayLimit);

  const collapseVariants = {
    open: {
      maxHeight: "2000px",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
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
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold cursor-pointer" onClick={toggleCollapse}>
          Your Recent Requests
          <Button variant="ghost" size="icon" className="ml-2 p-0 h-auto w-auto">
            {isCollapsed ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
          </Button>
        </h3>
        <div className="flex items-center space-x-2">
          <Label htmlFor="request-limit" className="text-sm">Show:</Label>
          <Select onValueChange={handleLimitChange} defaultValue={String(displayLimit)}>
            <SelectTrigger className="w-[80px] sm:w-[100px] text-sm">
              <SelectValue placeholder={`${displayLimit} requests`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            className="collapsible-wrapper"
            variants={collapseVariants}
            initial="collapsed"
            animate="open"
            exit="collapsed"
          >
            <div>
              {loading && requests.length === 0 ? (
                <div className="text-center py-4">Loading requests...</div>
              ) : displayedRequests.length === 0 && !loading ? (
                <div className="text-center py-4 text-gray-500">
                  No recent requests found
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{request.bookName}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {request.authorName} • {request.isbn || "No ISBN"}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
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
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Notes:</span> {request.additionalNotes}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Requested on: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {hasMore && requests.length > displayLimit && (
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleShowMore}
                        disabled={loading}
                      >
                        Show More
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}