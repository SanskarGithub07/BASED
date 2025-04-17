import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function RecentBookRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(3); // Default to show 3 recent requests

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:8080/api/request/user?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, [limit]);

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your Recent Requests</h3>
        {requests.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLimit(prev => prev + 3)}
            disabled={loading}
          >
            Show More
          </Button>
        )}
      </div>

      {loading && requests.length === 0 ? (
        <div className="text-center py-4">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No recent requests found
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
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
        </div>
      )}
    </div>
  );
}