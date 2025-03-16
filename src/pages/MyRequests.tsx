
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckSquare, FileText, Eye, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../components/navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleCheckboxChange = (id: string) => {
    setSelectedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(requestId => requestId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(requests.map(request => request.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSendForApproval = () => {
    if (selectedRequests.length === 0) {
      toast.error("Please select at least one request to send for approval");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      // Update requests in local storage
      const updatedRequests = requests.map(request => 
        selectedRequests.includes(request.id)
          ? { ...request, status: "under review" }
          : request
      );
      
      localStorage.setItem("hawk_eye_requests", JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
      setSelectedRequests([]);
      setIsSubmitting(false);
      
      toast.success(`${selectedRequests.length} request(s) sent for approval`);
    }, 1500);
  };

  const handleViewStatus = () => {
    navigate("/request-status");
  };

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
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
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
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back to Dashboard
                </Button>
                <h1 className="text-2xl font-bold text-hawk ml-4">My Requests</h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewStatus}
                className="flex items-center gap-2"
              >
                <Eye size={16} />
                View Status
              </Button>
            </div>
            
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-500 mb-4">You haven't created any requests yet.</p>
                <Button onClick={() => navigate("/new-request")}>Create Request</Button>
              </div>
            ) : (
              <>
                <div className="rounded-md border mb-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedRequests.length === requests.length && requests.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Deal Type</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Validity</TableHead>
                        <TableHead>Cost Center</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Est. Cost</TableHead>
                        <TableHead>Outlet</TableHead>
                        <TableHead>Trade Class</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedRequests.includes(request.id)}
                              onCheckedChange={() => handleCheckboxChange(request.id)}
                              disabled={request.status !== "pending"}
                            />
                          </TableCell>
                          <TableCell>{request.dealType}</TableCell>
                          <TableCell>{request.material}</TableCell>
                          <TableCell>{getValidityPeriod(request.validityStart, request.validityEnd)}</TableCell>
                          <TableCell>{request.costCenter}</TableCell>
                          <TableCell>₹{request.discount}</TableCell>
                          <TableCell>₹{request.availableBudget}</TableCell>
                          <TableCell>₹{request.totalEstimatedCost}</TableCell>
                          <TableCell>{request.searchOutlet}</TableCell>
                          <TableCell>{request.classOfTrade}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleSendForApproval}
                    disabled={selectedRequests.length === 0 || isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckSquare size={16} />
                        Send {selectedRequests.length} Requests for Approval
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MyRequests;
