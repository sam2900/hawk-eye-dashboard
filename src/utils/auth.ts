
import { User, USERS, MOCK_PASSWORDS } from "./constants";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

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
      
      // Add ID if not present
      const userWithId = {
        ...user,
        id: user.id || uuidv4()
      };
      
      // Set current user
      currentUser = userWithId;
      
      // Store in session storage
      const users = JSON.parse(sessionStorage.getItem("hawk_eye_users") || "[]");
      const existingUserIndex = users.findIndex((u: User) => u.username === userWithId.username);
      
      if (existingUserIndex >= 0) {
        users[existingUserIndex] = userWithId;
      } else {
        users.push(userWithId);
      }
      
      sessionStorage.setItem("hawk_eye_users", JSON.stringify(users));
      sessionStorage.setItem("hawk_eye_user", JSON.stringify(userWithId));
      
      // Save users to localStorage as well to make it persistent
      localStorage.setItem("hawk_eye_persistent_user", JSON.stringify(userWithId));
      
      toast.success(`Welcome back, ${userWithId.name}!`);
      resolve(userWithId);
    }, 800); // Simulate network delay
  });
};

// Logout function
export const logout = (): void => {
  currentUser = null;
  sessionStorage.removeItem("hawk_eye_user");
  localStorage.removeItem("hawk_eye_persistent_user");
  toast.success("You have been logged out");
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (currentUser) {
    return currentUser;
  }
  
  // First try to get from session storage
  const storedUser = sessionStorage.getItem("hawk_eye_user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  // If not in session storage, try from localStorage for persistence
  const persistentUser = localStorage.getItem("hawk_eye_persistent_user");
  if (persistentUser) {
    currentUser = JSON.parse(persistentUser);
    // Restore to session storage too
    sessionStorage.setItem("hawk_eye_user", persistentUser);
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
