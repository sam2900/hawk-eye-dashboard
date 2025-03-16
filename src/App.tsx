
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewRequest from "./pages/NewRequest";
import MyRequests from "./pages/MyRequests";
import RequestStatus from "./pages/RequestStatus";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import UserRequests from "./pages/UserRequests";
import { useEffect } from "react";
import { USERS, MOCK_PASSWORDS } from "./utils/constants";

const queryClient = new QueryClient();

// Initialize localStorage with demo data if empty
const initializeLocalStorage = () => {
  // Check if users are already in sessionStorage
  if (!sessionStorage.getItem("hawk_eye_users")) {
    sessionStorage.setItem("hawk_eye_users", JSON.stringify(USERS));
  }
  
  // Check if requests are already in localStorage
  if (!localStorage.getItem("hawk_eye_requests")) {
    localStorage.setItem("hawk_eye_requests", JSON.stringify([]));
  }
};

const App = () => {
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LazyMotion features={domAnimation}>
          <Toaster />
          <Sonner position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-request" element={<NewRequest />} />
              <Route path="/my-requests" element={<MyRequests />} />
              <Route path="/request-status" element={<RequestStatus />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/user-requests/:userId" element={<UserRequests />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LazyMotion>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
