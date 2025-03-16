
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../utils/auth";
import { APP_NAME } from "../utils/constants";
import LazyHawkAnimation from "./ui/hawk-animation";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    
    setLoading(true);
    
    try {
      const user = await login(username, password);
      
      if (user) {
        // Navigate based on role
        if (user.role === "sales_rep") {
          navigate("/dashboard");
        } else if (user.role === "district_manager") {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      // Toast is already shown in the login function
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="w-full max-w-md p-8 rounded-2xl glassmorphism">
      <div className="flex flex-col items-center justify-center mb-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-24 h-24 mb-4 rounded-full bg-hawk flex items-center justify-center drop-shadow-xl"
        >
          <svg 
            viewBox="0 0 24 24" 
            width="48" 
            height="48" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-black"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {APP_NAME}
        </motion.h1>
        
        <motion.p 
          className="text-muted-foreground text-center mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Sign in to your account
        </motion.p>
      </div>

      <motion.form 
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="space-y-2">
          <label htmlFor="username" className="hawk-label">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="hawk-input w-full"
            placeholder="john.doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="hawk-label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="hawk-input w-full pr-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="text-sm text-right">
            <a href="#" className="text-hawk hover:text-hawk-dark">
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className={`hawk-button hawk-button-primary w-full h-10 ${loading ? 'opacity-70' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </motion.form>

      <div className="h-16 mt-8 relative">
        <LazyHawkAnimation className="h-full" />
      </div>
      
      <div className="text-xs text-center mt-8 text-muted-foreground">
        <p>Demo accounts:</p>
        <p className="mt-1">Sales Rep: john.doe / password123</p>
        <p className="mt-1">District Manager: mike.wilson / password123</p>
      </div>
    </div>
  );
};

export default LoginForm;
