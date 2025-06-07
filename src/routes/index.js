import { lazy } from "react";

const DailyReport = lazy(() => import("../Pages/DailyReport.js"));
const Inventory = lazy(() => import("../Pages/Inventory.js"));
const Billing = lazy(() => import("../Pages/Billing.js"));
const Indent = lazy(() => import("../Pages/Indent.js"));
const Dashboard = lazy(() => import("../Pages/Dashboard.js"));
const WOListing = lazy(() => import("../Pages/WOListing.js"));
const Login = lazy(() => import("../Pages/Login.js"));
const LabourBill = lazy(() => import("../Pages/LabourBill.js"));
const LabourPayments = lazy(() => import("../Pages/LabourPayment.js"));
const ClientPayments = lazy(() => import("../Pages/ClientPayments.js"));
const AddClientPayment = lazy(() => import("../Pages/AddClientPayment.js"));
const Projects = lazy(() => import("../Pages/Projects.js"));

const pageroutes = [
  {
    path: "/app/projects",
    component: Projects,
  },
  {
    path: "/app/dwa",
    component: DailyReport,
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
    path: "/app/project/:projectId/dashboard",
    component: Dashboard,
  },
  {
    path: "/app/project/:projectId/dwa",
    component: DailyReport,
  },
  {
    path: "/app/project/:projectId/inventory",
    component: Inventory,
  },
  {
    path: "/app/project/:projectId/drawings",
    component: Billing,
  },
  {
    path: "/app/project/:projectId/generalinfo",
    component: Indent,
  },
  {
    path: "/app/project/:projectId/labourbill",
    component: LabourBill,
  },
  {
    path: "/app/project/:projectId/labourpayments",
    component: LabourPayments,
  },
  {
    path: "/app/project/:projectId/dwa/wo",
    component: WOListing,
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
  {
    path: "/app/clientpayments",
    component: ClientPayments,
  },
  {
    path: "/app/clientpayments/add",
    component: AddClientPayment,
  },
  {
    path: "/app/project/:projectId/clientpayments",
    component: ClientPayments,
  },
  {
    path: "/app/project/:projectId/clientpayments/add",
    component: AddClientPayment,
  }
];
export default pageroutes;
