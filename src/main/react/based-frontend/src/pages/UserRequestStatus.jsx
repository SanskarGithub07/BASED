import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GlassCard from "../components/xp-ui/GlassCard";

const statusVariant = {
  PENDING: "secondary",
  REVIEWED: "info",
  ADDED: "success",
  REJECTED: "destructive",
};

export default function UserRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const response = await axios.get("/api/request/user");
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRequests();
  }, []);

  return (
    <GlassCard className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Book Requests</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">Loading your requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-8">You haven't made any requests yet.</div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{request.bookName}</span>
                  <Badge variant={statusVariant[request.status]}>
                    {request.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Author</p>
                    <p>{request.authorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ISBN</p>
                    <p>{request.isbn || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Request Date</p>
                    <p>{new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {request.additionalNotes && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Your Notes</p>
                    <p>{request.additionalNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </GlassCard>
  );
}