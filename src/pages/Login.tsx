
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoginForm from "../components/login-form";
import { isAuthenticated } from "../utils/auth";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-hawk-hero bg-cover bg-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full max-w-md z-10"
      >
        <LoginForm />
      </motion.div>

      <motion.div
        className="absolute bottom-4 text-white/60 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        © {new Date().getFullYear()} Hawk Eye. All rights reserved.
      </motion.div>
    </div>
  );
};

export default Login;
