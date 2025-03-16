
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Home, PlusCircle, BarChart2, Database, LogOut, Menu, X } from "lucide-react";
import { getCurrentUser, logout } from "../utils/auth";
import { APP_NAME, APP_ROUTES, User as UserType } from "../utils/constants";
import { useIsMobile } from "../hooks/use-mobile";

const Navbar = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setUser(getCurrentUser());
  }, [location]);
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Home": return <Home size={20} />;
      case "PlusCircle": return <PlusCircle size={20} />;
      case "BarChart2": return <BarChart2 size={20} />;
      case "Database": return <Database size={20} />;
      default: return null;
    }
  };

  const filteredRoutes = APP_ROUTES.filter(route => 
    user && user.role && route.roles.includes(user.role as any)
  );
  
  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="text-hawk font-bold text-xl mr-8">{APP_NAME}</div>
            
            {!isMobile && (
              <nav className="hidden md:flex space-x-1">
                {filteredRoutes.map((route) => (
                  <motion.a
                    key={route.path}
                    href={route.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === route.path
                        ? "text-hawk bg-white/5"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {getIcon(route.icon)}
                    <span className="ml-2">{route.label}</span>
                  </motion.a>
                ))}
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <motion.div 
                  className="hidden md:flex items-center space-x-2 pr-4 text-white/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-sm">{user.name}</span>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-white/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-hawk flex items-center justify-center">
                      <User size={16} className="text-hawk-foreground" />
                    </div>
                  )}
                </motion.div>
                
                <motion.button
                  className="hidden md:flex items-center justify-center px-3 py-2 rounded-md bg-red-600 text-white text-sm font-medium transition-colors hover:bg-red-700"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={18} />
                  <span className="ml-2">Logout</span>
                </motion.button>
                
                {/* Mobile menu button */}
                <motion.button
                  className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-black/90 pt-16"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              {user && (
                <div className="flex items-center mb-6 pb-6 border-b border-white/10">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border border-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-hawk flex items-center justify-center">
                      <User size={20} className="text-hawk-foreground" />
                    </div>
                  )}
                  <div className="ml-3">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-white/60 text-sm capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                </div>
              )}
              
              <nav className="flex flex-col space-y-2">
                {filteredRoutes.map((route) => (
                  <motion.a
                    key={route.path}
                    href={route.path}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium ${
                      location.pathname === route.path
                        ? "text-hawk bg-white/5"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                    whileHover={{ scale: 1.03, x: 5 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {getIcon(route.icon)}
                    <span className="ml-3">{route.label}</span>
                  </motion.a>
                ))}
                
                <motion.button
                  className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-red-400 hover:text-red-300 hover:bg-white/5 mt-4"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.03, x: 5 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <LogOut size={20} />
                  <span className="ml-3">Logout</span>
                </motion.button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
