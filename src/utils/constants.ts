
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
  "Obsolescence",
  "Volume Uplift",
  "Retention",
  "Availability",
  "EDLP",
  "Pricing",
  "Other - provide reason (reason dene keliye ek chota text box de sakte ho when they select other)"
];

export const MATERIAL_TYPES = [
  'ZA_000000000000092052',
  'ZA_000000000000093940',
  'ZA_000000000000094762',
  'ZA_000000000000094505',
  'ZA_000000000000094523',
  'ZA_000000000000094045',
  'ZA_000000000000094182',
  'ZA_000000000000094334',
  'ZA_000000000000094435',
  'ZA_000000000000094070',
  'ZA_000000000000085021'
]
export const SEARCH_OUTLET = [
  'ZA_0000303394',
  'ZA_0000307961',
  'ZA_0000308329',
  'ZA_0000308540',
  'ZA_0000308564',
  'ZA_0000308719',
  'ZA_0000309391',
  'ZA_0000309432'
]
export const SALES_AREA = [
  "POLOKWANE SOUTH",
  "POLOKWANE EAST",
  "ISANDO NORTH",
  "POLOKWANE WEST",
  "TZANEEN",
  "TSHWANE URBAN IN HOME",
  "MSUNDUZI EAST",
  "MAFIKENG HYBRID WEST",
  "DWARSLOOP",
  "POLOKWANE CENTRAL",
  "KIMBERLEY HYBRID"
]

export const BRAND_NAME = [
  'CORONA 355 NRB',
  'BLACK CROWN GIN AND TONIC 440 CAN',
  'STELLA ARTOIS 620 NRB',
  'BRUTAL FRUIT STRAWBERRY ROUGE 500 CAN',
  'BRUTAL FRUIT LITCHI SECHE 500 CAN',
  'BRUTAL FRUIT RUBY APPLE 500 CAN',
  'CARLING BLACK LABEL 750 RB',
  'CASTLE DOUBLE MALT 660 RB',
  'BRUTAL FRUIT RUBY APPLE 620 NRB',
  'CASTLE LITE 500 CAN'
]
export const BRAND_FAMILY = [
  'CORONA',
  'BLACK CROWN',
  'STELLA ARTOIS',
  'BRUTAL FRUIT',
  'CARLING BLACK LABEL',
  'CASTLE DOUBLE MALT',
  'FLYING FISH'
]
export const TRADE_CLASSES = [
  "CLASSIC TAVERN",
  "WS MAIN MARKET LARGE",
  "CS TAKE AWAY",
  "SS SPECIALITY LIQUOR",
  "WS MAIN MARKET LARGE",
  "SS LOCAL NEIGHBOURHD"
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
