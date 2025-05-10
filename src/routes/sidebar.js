import {
  ChartColumnBig,
  BriefcaseBusiness,
  Boxes,
  ReceiptIndianRupee,
  DraftingCompass,
  BadgeInfo,
  HandCoins,
  ListTodo,
} from "lucide-react";

const sidebarroutes = [
  {
    path: "/app/dashboard",
    icon: <ChartColumnBig size={18} />,
    name: "Dashboard",
  },

  {
    path: "/app/dwa",
    icon: <ListTodo size={18} />,
    name: "Daily Report",
  },
  {
    path: "/app/inventory",
    icon: <Boxes size={18} />,
    name: "Inventory",
  },
  {
    path: "/app/drawings",
    icon: <DraftingCompass size={18} />,
    name: "Drawings",
  },
  {
    path: "/app/generalinfo",
    icon: <BadgeInfo size={18} />,
    name: "General Info",
  },
  {
    path: "/app/labourbill",
    icon: <ReceiptIndianRupee size={18} />,
    name: "Labour Bill",
  },
  {
    path: "/app/labourpayments",
    icon: <HandCoins size={18} />,
    name: "Labour Payments",
  },
];

export default sidebarroutes;
