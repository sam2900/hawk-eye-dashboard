
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckSquare, FileText, Eye, ArrowLeft, Info } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../components/navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { isAuthenticated, getCurrentUser } from "../utils/auth";
import { Request, getUserRequests, submitRequestForApproval } from "../utils/request-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const user = getCurrentUser();

  useEffect(() => {
    // If not authenticated or not a sales rep, redirect
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (user && user.role !== "sales_rep") {
      navigate("/dashboard");
      return;
    }

    // Fetch requests from local storage
    if (user) {
      const userRequests = getUserRequests(user.id);
      setRequests(userRequests);
    }
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
      const pendingRequests = requests
        .filter(request => request.status === "pending" && !request.submittedForApproval)
        .map(request => request.id);
      setSelectedRequests(pendingRequests);
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

    // Process each selected request
    const promises = selectedRequests.map(requestId =>
      submitRequestForApproval(requestId)
    );

    // After all requests are processed
    Promise.all(promises)
      .then(() => {
        // Update local state
        const updatedRequests = requests.map(request =>
          selectedRequests.includes(request.id)
            ? { ...request, submittedForApproval: true }
            : request
        );

        setRequests(updatedRequests);
        setSelectedRequests([]);
        toast.success(`${selectedRequests.length} request(s) sent for approval`);
      })
      .catch(error => {
        console.error("Error submitting requests:", error);
        toast.error("Failed to submit some requests");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleViewStatus = () => {
    navigate("/request-status");
  };

  const handleShowDetails = (request: Request) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
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
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen pt-24 pb-12 px-4 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1572177200344-496ea8c15e1f?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", backgroundRepeat: 'no-repeat',

        }}
      >
        <div className="absolute inset-0 bg-black/40 " />
        <div className="container mx-auto max-w-6xl relative z-10" style={{ opacity: "0.9" }}>
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
                            checked={selectedRequests.length > 0 && selectedRequests.length === requests.filter(r => r.status === "pending" && !r.submittedForApproval).length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Deal Type</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Validity</TableHead>
                        <TableHead>Cost Center</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedRequests.includes(request.id)}
                              onCheckedChange={() => handleCheckboxChange(request.id)}
                              disabled={request.status !== "pending" || request.submittedForApproval}
                            />
                          </TableCell>
                          <TableCell>{request.dealType}</TableCell>
                          <TableCell>{request.material}</TableCell>
                          <TableCell>{getValidityPeriod(request.validityStart, request.validityEnd)}</TableCell>
                          <TableCell>{request.costCenter}</TableCell>
                          <TableCell>{request.discount}(R/HL)</TableCell>
                          <TableCell>{request.availableBudget}(R/HL)</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.submittedForApproval && request.status === "pending"
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                              {request.submittedForApproval && request.status === "pending"
                                ? 'Under Review'
                                : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleShowDetails(request)}
                              className="h-8 w-8"
                            >
                              <Info size={16} />
                            </Button>
                          </TableCell>
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

      {/* Request Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Created {selectedRequest && formatDate(selectedRequest.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <h4 className="text-sm font-semibold mb-1">Deal Type:</h4>
                <p className="text-sm">{selectedRequest.dealType}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Material:</h4>
                <p className="text-sm">{selectedRequest.material}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Validity Period:</h4>
                <p className="text-sm">{getValidityPeriod(selectedRequest.validityStart, selectedRequest.validityEnd)}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Cost Center:</h4>
                <p className="text-sm">{selectedRequest.costCenter}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Discount:</h4>
                <p className="text-sm">{selectedRequest.discount}(R/HL)</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Available Budget:</h4>
                <p className="text-sm">{selectedRequest.availableBudget}(R/HL)</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Total Estimated Cost:</h4>
                <p className="text-sm">{selectedRequest.totalEstimatedCost}(R/HL)</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Search Outlet:</h4>
                <p className="text-sm">{selectedRequest.searchOutlet}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Class of Trade:</h4>
                <p className="text-sm">{selectedRequest.classOfTrade}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Sales Area:</h4>
                <p className="text-sm">{selectedRequest.salesArea}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-semibold mb-1">Status:</h4>
                <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${selectedRequest.submittedForApproval && selectedRequest.status === "pending"
                  ? 'bg-yellow-100 text-yellow-800'
                  : selectedRequest.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : selectedRequest.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                  {selectedRequest.submittedForApproval && selectedRequest.status === "pending"
                    ? 'Under Review'
                    : selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </p>
              </div>

              {selectedRequest.feedback && (
                <div className="col-span-2">
                  <h4 className="text-sm font-semibold mb-1">Feedback:</h4>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedRequest.feedback}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyRequests;
