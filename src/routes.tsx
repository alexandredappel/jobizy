import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import WorkerOnboarding from "./pages/worker/WorkerOnboarding";
import WorkerProfileEdit from "./pages/worker/WorkerProfileEdit";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import BusinessOnboarding from "./pages/business/BusinessOnboarding";
import BusinessProfileEdit from "./pages/business/BusinessProfileEdit";
import Search from "./pages/business/Search";
import WorkerProfile from "./pages/profiles/WorkerProfile";
import BusinessProfile from "./pages/profiles/BusinessProfile";
import AuthLayout from "./layouts/auth";
import BaseLayout from "./layouts/base/BaseLayout";

export const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/worker",
        children: [
          {
            path: "dashboard",
            element: <WorkerDashboard />,
          },
          {
            path: "onboarding",
            element: <WorkerOnboarding />,
          },
          {
            path: "profile/edit",
            element: <WorkerProfileEdit />,
          },
        ],
      },
      {
        path: "/business",
        children: [
          {
            path: "dashboard",
            element: <BusinessDashboard />,
          },
          {
            path: "onboarding",
            element: <BusinessOnboarding />,
          },
          {
            path: "profile/edit",
            element: <BusinessProfileEdit />,
          },
          {
            path: "search",
            element: <Search />,
          },
        ],
      },
      {
        path: "/profiles/worker/:id",
        element: <WorkerProfile />,
      },
      {
        path: "/profiles/business/:id",
        element: <BusinessProfile />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);