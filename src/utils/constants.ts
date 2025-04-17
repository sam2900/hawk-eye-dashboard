
export const APP_NAME = "Hawk Eye";
export const APP_DESCRIPTION = "Premium beverage sales management platform";

export interface User {
  id: string;
  username: string;
  name: string;
  role: "sales_rep" | "district_manager";
  region?: string;
  avatar?: string;
}

// Mock users for development
export const USERS: User[] = [
  {
    id: "1",
    username: "john.doe",
    name: "John Doe",
    role: "sales_rep",
    region: "North",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=FBB829&color=fff"
  },
  {
    id: "2",
    username: "jane.smith",
    name: "Jane Smith",
    role: "sales_rep",
    region: "East",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=FBB829&color=fff"
  },
  {
    id: "3",
    username: "mike.wilson",
    name: "Mike Wilson",
    role: "district_manager",
    region: "National",
    avatar: "https://ui-avatars.com/api/?name=Mike+Wilson&background=FBB829&color=fff"
  }
];

export const MOCK_PASSWORDS = {
  "john.doe": "password123",
  "jane.smith": "password123",
  "mike.wilson": "password123"
};

export const DEAL_TYPES = [
  "Standard Promotion",
  "Seasonal Discount",
  "Volume-based Deal",
  "New Product Launch",
  "Loyalty Program",
  "Bundle Offer"
];

export const TRADE_CLASSES = [
  "Modern Trade",
  "General Trade",
  "Key Accounts",
  "Horeca",
  "Wholesale",
  "E-commerce"
];

export interface Route {
  path: string;
  label: string;
  icon: string;
  roles: Array<"sales_rep" | "district_manager">;
}

export const APP_ROUTES: Route[] = [
  {
    path: "/dashboard",
    label: "Home",
    icon: "Home",
    roles: ["sales_rep", "district_manager"]
  },
  {
    path: "/new-request",
    label: "New Request",
    icon: "PlusCircle",
    roles: ["sales_rep"]
  },
  {
    path: "/my-requests",
    label: "View Request",
    icon: "BarChart2",
    roles: ["sales_rep", "district_manager"]
  },
  {
    path: "/request-status",
    label: "View Status",
    icon: "Database",
    roles: ["sales_rep", "district_manager"]
  }
];
