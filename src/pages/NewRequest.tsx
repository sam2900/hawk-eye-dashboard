
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
      <div style={{

      }}>
        <div
          className="min-h-screen pt-24 pb-12 px-4 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1572177200344-496ea8c15e1f?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", backgroundRepeat: 'no-repeat',

          }}

        >
          <div className="absolute inset-0 bg-black/40 " />
          <div className="container mx-auto max-w-4xl relative z-10">
            <motion.div
              className="hawk-card p-8 bg-white/90 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RequestForm />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewRequest;
