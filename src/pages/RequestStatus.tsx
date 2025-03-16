
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Info } from "lucide-react";
import Navbar from "../components/navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isAuthenticated, getCurrentUser } from "../utils/auth";

interface Request {
  id: string;
  dealType: string;
  material: string;
  costCenter: string;
  validityStart: string;
  validityEnd: string;
  discount: number;
  availableBudget: string;
  totalEstimatedCost: string;
  searchOutlet: string;
  classOfTrade: string;
  salesArea: string;
  status: string;
  createdAt: string;
}

const RequestStatus = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const user = getCurrentUser();
  
  useEffect(() => {
    // If not authenticated or not a sales rep, redirect
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    if (user && user.role !== "sales_rep") {
      navigate("/dashboard");
    }
    
    // Fetch requests from local storage (for demo)
    const storedRequests = JSON.parse(localStorage.getItem("hawk_eye_requests") || "[]");
    setRequests(storedRequests);
  }, [navigate, user]);

  const getValidityPeriod = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    return `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen pt-24 pb-12 px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/f85bc74a-85e1-4bd0-9581-e467472dcb2c.png')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            className="hawk-card p-8 bg-white/90 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/my-requests")}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Requests
              </Button>
              <h1 className="text-2xl font-bold text-hawk ml-4">Request Status</h1>
            </div>
            
            <div className="rounded-md border mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length > 0 ? (
                    requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.dealType}</TableCell>
                        <TableCell>{request.material}</TableCell>
                        <TableCell>{getValidityPeriod(request.validityStart, request.validityEnd)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Info size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Cost Center: {request.costCenter}</p>
                                <p>Discount: ₹{request.discount}</p>
                                <p>Budget: ₹{request.availableBudget}</p>
                                <p>Est. Cost: ₹{request.totalEstimatedCost}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        No requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RequestStatus;
