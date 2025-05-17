import { lazy } from "react";

const Dwamain = lazy(() => import("../Pages/Dwamain.js"));
const Inventory = lazy(() => import("../Pages/Inventory.js"));
const Billing = lazy(() => import("../Pages/Billing.js"));
const Indent = lazy(() => import("../Pages/Indent.js"));
const Dashboard = lazy(() => import("../Pages/Dashboard.js"));
const WOListing = lazy(() => import("../Pages/WOListing.js"));
const Login = lazy(() => import("../Pages/Login.js"));
const LabourBill = lazy(() => import("../Pages/LabourBill.js"));
const LabourPayments = lazy(() => import("../Pages/LabourPayment.js"));
const Projects = lazy(() => import("../Pages/Projects.js"));

const pageroutes = [
  {
    path: "/app/projects",
    component: Projects,
  },
  {
    path: "/app/dwa",
    component: Dwamain,
  },
  {
    path: "/app/inventory",
    component: Inventory,
  },
  {
    path: "/app/drawings",
    component: Billing,
  },
  {
    path: "/app/generalinfo",
    component: Indent,
  },
  {
    path: "/app/dashboard",
    component: Dashboard,
  },
  {
    path: "/app/dwa/wo",
    component: WOListing,
  },
  {
    path: "/app/labourbill",
    component: LabourBill,
  },
  {
    path: "/app/labourpayments",
    component: LabourPayments,
  },
];
export default pageroutes;
