
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import RequestForm from "../components/request-form";
import { isAuthenticated, getCurrentUser } from "../utils/auth";

const NewRequest = () => {
  const navigate = useNavigate();
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
  }, [navigate, user]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-hawk-pattern pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="hawk-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RequestForm />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NewRequest;
