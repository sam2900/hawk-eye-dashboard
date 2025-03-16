
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { getCurrentUser } from "./auth";

export interface Request {
  id: string;
  userId: string;
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
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  createdAt: string;
  submittedForApproval: boolean;
}

// Save a new request to localStorage
export const saveRequest = (request: Omit<Request, 'id' | 'createdAt' | 'status' | 'submittedForApproval'>): Request => {
  const storedRequests: Request[] = JSON.parse(localStorage.getItem('hawk_eye_requests') || '[]');
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error("User not authenticated");
  }
  
  const newRequest: Request = {
    ...request,
    id: uuidv4(),
    userId: currentUser.id,
    createdAt: new Date().toISOString(),
    status: 'pending',
    submittedForApproval: false
  };
  
  localStorage.setItem('hawk_eye_requests', JSON.stringify([...storedRequests, newRequest]));
  console.log("Saved request:", newRequest);
  return newRequest;
};

// Get requests for a specific user
export const getUserRequests = (userId: string): Request[] => {
  const storedRequests: Request[] = JSON.parse(localStorage.getItem('hawk_eye_requests') || '[]');
  return storedRequests.filter(request => request.userId === userId);
};

// Get all requests in the system
export const getAllRequests = (): Request[] => {
  return JSON.parse(localStorage.getItem('hawk_eye_requests') || '[]');
};

// Submit a request for approval
export const submitRequestForApproval = (requestId: string): boolean => {
  const storedRequests: Request[] = JSON.parse(localStorage.getItem('hawk_eye_requests') || '[]');
  const updatedRequests = storedRequests.map(request => 
    request.id === requestId 
      ? { ...request, submittedForApproval: true } 
      : request
  );
  
  localStorage.setItem('hawk_eye_requests', JSON.stringify(updatedRequests));
  toast.success("Request submitted for approval");
  return true;
};

// Update the status of a request
export const updateRequestStatus = (
  requestId: string, 
  status: "approved" | "rejected", 
  feedback?: string
): boolean => {
  const storedRequests: Request[] = JSON.parse(localStorage.getItem('hawk_eye_requests') || '[]');
  
  // Find the request in question
  const requestIndex = storedRequests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1) {
    toast.error("Request not found");
    return false;
  }
  
  // Update the request
  storedRequests[requestIndex] = {
    ...storedRequests[requestIndex],
    status,
    feedback
  };
  
  localStorage.setItem('hawk_eye_requests', JSON.stringify(storedRequests));
  toast.success(`Request ${status}`);
  console.log("Updated request:", storedRequests[requestIndex]);
  return true;
};

// Calculate stats for admin dashboard
export interface UserStat {
  userId: string;
  username: string;
  name?: string;
  totalBudget: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface AdminStats {
  totalUsers: number;
  activeDeals: number;
  pendingApprovals: number;
  userStats: UserStat[];
}

export const getAdminStats = (): AdminStats => {
  const users = JSON.parse(sessionStorage.getItem('hawk_eye_users') || '[]');
  const requests: Request[] = JSON.parse(localStorage.getItem('hawk_eye_requests') || '[]');
  
  // Get only sales rep users
  const salesReps = users.filter((user: any) => user.role === 'sales_rep');
  
  const userStats = salesReps.map((user: any) => {
    const userRequests = requests.filter(req => req.userId === user.id);
    const pendingCount = userRequests.filter(req => req.status === 'pending' && req.submittedForApproval).length;
    const approvedCount = userRequests.filter(req => req.status === 'approved').length;
    const rejectedCount = userRequests.filter(req => req.status === 'rejected').length;
    
    // Calculate total budget from all requests
    const totalBudget = userRequests.reduce((sum, req) => {
      const budget = parseFloat(req.availableBudget.replace(/[^0-9.]/g, '')) || 0;
      return sum + budget;
    }, 0);
    
    return {
      userId: user.id,
      username: user.username,
      name: user.name,
      totalBudget,
      pendingCount,
      approvedCount,
      rejectedCount
    };
  });

  const stats = {
    totalUsers: salesReps.length,
    activeDeals: requests.filter(req => req.status === 'approved').length,
    pendingApprovals: requests.filter(req => req.status === 'pending' && req.submittedForApproval).length,
    userStats
  };
  
  console.log("Generated admin stats:", stats);
  return stats;
};
