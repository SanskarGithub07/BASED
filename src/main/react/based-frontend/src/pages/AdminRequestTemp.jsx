import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GlassCard from "../components/xp-ui/GlassCard";

const statusVariant = {
  PENDING: "secondary",
  REVIEWED: "info",
  ADDED: "success",
  REJECTED: "destructive",
};

export default function BookRequestAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("/api/request");
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await axios.patch(`/api/request/${requestId}/status`, null, {
        params: { status: newStatus }
      });
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <GlassCard className="p-6">
      <h2 className="text-2xl font-bold mb-6">Book Requests Management</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">Loading requests...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Requesters</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.bookName}</TableCell>
                <TableCell>{request.authorName}</TableCell>
                <TableCell>{request.isbn}</TableCell>
                <TableCell>{request.requesters.length}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[request.status]}>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={request.status}
                    onValueChange={(value) => handleStatusChange(request.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">PENDING</SelectItem>
                      <SelectItem value="REVIEWED">REVIEWED</SelectItem>
                      <SelectItem value="ADDED">ADDED</SelectItem>
                      <SelectItem value="REJECTED">REJECTED</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </GlassCard>
  );
}