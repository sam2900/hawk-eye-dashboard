
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Info, CheckCircle, XCircle, LogOut } from "lucide-react";
import { isAuthenticated, getCurrentUser, logout } from "../utils/auth";
import { Request, getAllRequests, updateRequestStatus } from "../utils/request-utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface UserInfo {
  id: string;
  name: string;
  username: string;
}

const UserRequests = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [requests, setRequests] = useState<Request[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    // If not authenticated or not a district manager, redirect
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (user && user.role !== "district_manager") {
      navigate("/dashboard");
      return;
    }

    if (!userId) {
      navigate("/admin");
      return;
    }

    loadUserRequests();

  }, [navigate, user, userId]);

  const loadUserRequests = () => {
    // Get all requests and filter for this user
    const allRequests = getAllRequests();
    const userRequests = allRequests.filter(req => req.userId === userId && req.submittedForApproval);
    setRequests(userRequests);

    // Get user info from session storage
    const users = JSON.parse(sessionStorage.getItem('hawk_eye_users') || '[]');
    const userInfo = users.find((u: any) => u.id === userId);
    if (userInfo) {
      setUserInfo({
        id: userInfo.id,
        name: userInfo.name || userInfo.username,
        username: userInfo.username
      });
    } else {
      navigate("/admin");
    }
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

  const handleShowDetails = (request: Request) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const handleAction = (request: Request, type: "approved" | "rejected") => {
    setSelectedRequest(request);
    setActionType(type);
    setFeedbackOpen(true);
  };

  const handleBulkAction = (type: "approved" | "rejected") => {
    if (selectedRequests.length === 0) {
      toast.error("Please select at least one request");
      return;
    }

    setActionType(type);
    setBulkActionOpen(true);
  };

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
        .filter(request => request.status === "pending")
        .map(request => request.id);
      setSelectedRequests(pendingRequests);
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSubmitAction = () => {
    if (selectedRequest && actionType) {
      updateRequestStatus(selectedRequest.id, actionType, feedback);

      // Update local state
      setRequests(prev =>
        prev.map(req =>
          req.id === selectedRequest.id
            ? { ...req, status: actionType, feedback }
            : req
        )
      );

      // Close dialogs
      setFeedbackOpen(false);
      setFeedback("");
      setActionType(null);
    }
  };

  const handleSubmitBulkAction = () => {
    if (!actionType || selectedRequests.length === 0) return;

    // Process each selected request
    selectedRequests.forEach(requestId => {
      updateRequestStatus(requestId, actionType, feedback);
    });

    // Update local state
    setRequests(prev =>
      prev.map(req =>
        selectedRequests.includes(req.id)
          ? { ...req, status: actionType, feedback }
          : req
      )
    );

    // Reset state
    setBulkActionOpen(false);
    setFeedback("");
    setActionType(null);
    setSelectedRequests([]);

    toast.success(`${selectedRequests.length} requests ${actionType}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div
        className="min-h-screen pt-16 pb-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/bfbef245-8604-4839-ab07-ed06fa15252e.png')" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto flex justify-between items-center h-16 px-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 text-white/80 hover:text-white"
              >
                <ArrowLeft size={18} />
                <span>Back to Overview</span>
              </Button>
              <h1 className="text-xl font-bold text-hawk ml-4">User Requests</h1>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </header>

        <div className="container mx-auto max-w-6xl relative z-10 pt-8">
          <motion.div
            className="hawk-card p-8 bg-white/90 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {userInfo && (
              <div className="mb-6 p-4 bg-hawk-100 rounded-lg">
                <h2 className="text-xl font-semibold">
                  Requests for {userInfo.name} ({userInfo.username})
                </h2>
                <p className="text-sm text-gray-500">User ID: {userInfo.id}</p>
              </div>
            )}

            {/* Bulk actions */}
            {selectedRequests.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <p className="text-sm">{selectedRequests.length} requests selected</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600"
                    onClick={() => handleBulkAction("approved")}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Approve All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => handleBulkAction("rejected")}
                  >
                    <XCircle size={16} className="mr-2" />
                    Reject All
                  </Button>
                </div>
              </div>
            )}

            <div className="rounded-md border mb-6 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedRequests.length > 0 && selectedRequests.length === requests.filter(r => r.status === "pending").length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Deal Type</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Cost Center</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length > 0 ? (
                    requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <Checkbox
                            id={`select-${request.id}`}
                            checked={selectedRequests.includes(request.id)}
                            onCheckedChange={() => handleCheckboxChange(request.id)}
                            disabled={request.status !== "pending"}
                          />
                        </TableCell>
                        <TableCell>{request.dealType}</TableCell>
                        <TableCell>{request.material}</TableCell>
                        <TableCell>{getValidityPeriod(request.validityStart, request.validityEnd)}</TableCell>
                        <TableCell>{request.costCenter}</TableCell>
                        <TableCell>{request.availableBudget}(R/HL)</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleShowDetails(request)}
                          >
                            <Info size={16} />
                          </Button>
                          {request.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600"
                                onClick={() => handleAction(request, "approved")}
                              >
                                <CheckCircle size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600"
                                onClick={() => handleAction(request, "rejected")}
                              >
                                <XCircle size={16} />
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-gray-500">
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

      {/* Request Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Submitted {selectedRequest && formatDate(selectedRequest.createdAt)}
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
                <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${selectedRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
                  selectedRequest.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
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

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
            <DialogDescription>
              {actionType === 'approved' ? 'Approve' : 'Reject'} this request with optional feedback
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="Enter feedback for this request..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setFeedbackOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'approved' ? 'default' : 'destructive'}
              onClick={handleSubmitAction}
            >
              {actionType === 'approved' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk {actionType === 'approved' ? 'Approve' : 'Reject'}</DialogTitle>
            <DialogDescription>
              {actionType === 'approved' ? 'Approve' : 'Reject'} {selectedRequests.length} requests with the same feedback
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="Enter feedback for these requests..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setBulkActionOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'approved' ? 'default' : 'destructive'}
              onClick={handleSubmitBulkAction}
            >
              {actionType === 'approved' ? 'Approve All' : 'Reject All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserRequests;
