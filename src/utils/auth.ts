
import { User, USERS, MOCK_PASSWORDS } from "./constants";
import { toast } from "sonner";

// Simple auth state
let currentUser: User | null = null;

// Login function
export const login = (username: string, password: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    // Simulate network request
    setTimeout(() => {
      const user = USERS.find(u => u.username === username);
      
      if (!user) {
        toast.error("Invalid username or password");
        reject(new Error("Invalid username or password"));
        return;
      }
      
      if (MOCK_PASSWORDS[username as keyof typeof MOCK_PASSWORDS] !== password) {
        toast.error("Invalid username or password");
        reject(new Error("Invalid username or password"));
        return;
      }
      
      // Set current user
      currentUser = user;
      
      // Store in session storage
      sessionStorage.setItem("hawk_eye_user", JSON.stringify(user));
      
      toast.success(`Welcome back, ${user.name}!`);
      resolve(user);
    }, 800); // Simulate network delay
  });
};

// Logout function
export const logout = (): void => {
  currentUser = null;
  sessionStorage.removeItem("hawk_eye_user");
  toast.success("You have been logged out");
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (currentUser) {
    return currentUser;
  }
  
  const storedUser = sessionStorage.getItem("hawk_eye_user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Check if user has a specific role
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user !== null && user.role === role;
};
