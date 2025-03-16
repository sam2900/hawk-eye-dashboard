
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, CheckCircle, Clock, Eye, User } from "lucide-react";
import Navbar from "../components/navbar";
import { isAuthenticated, getCurrentUser } from "../utils/auth";
import { AdminStats, getAdminStats } from "../utils/request-utils";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
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
    
    // Load admin stats
    setStats(getAdminStats());
  }, [navigate, user]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!stats) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="hawk-card p-8">
              <p className="text-center">Loading...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen pt-24 pb-12 px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/bfbef245-8604-4839-ab07-ed06fa15252e.png')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            className="hawk-card p-8 bg-white/90 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-hawk mb-8">System Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <motion.div 
                className="hawk-card bg-amber-50 border-amber-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-amber-800">Total Users</h3>
                      <p className="text-4xl font-bold text-amber-600">{stats.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-100">
                      <Users className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="hawk-card bg-green-50 border-green-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-green-800">Active Deals</h3>
                      <p className="text-4xl font-bold text-green-600">{stats.activeDeals}</p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="hawk-card bg-orange-50 border-orange-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-orange-800">Pending Approvals</h3>
                      <p className="text-4xl font-bold text-orange-600">{stats.pendingApprovals}</p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <h2 className="text-2xl font-bold text-hawk mb-6">User Overview</h2>
            
            <div className="rounded-md border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.userStats.length > 0 ? (
                    stats.userStats.map((userStat) => (
                      <tr key={userStat.userId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-hawk rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{userStat.name}</div>
                              <div className="text-sm text-gray-500">{userStat.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {userStat.pendingCount} pending
                            </span>
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {userStat.approvedCount} approved
                            </span>
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {userStat.rejectedCount} rejected
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {formatCurrency(userStat.totalBudget)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => navigate(`/admin/user-requests/${userStat.userId}`)}
                          >
                            <Eye size={16} />
                            <span>View Requests</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
