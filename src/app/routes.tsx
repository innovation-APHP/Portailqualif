import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { Overview } from "./components/Overview";
import { SettingsPage } from "./components/SettingsPage";
import { NotFound } from "./components/NotFound";
import { DynamicAppPage } from "./components/DynamicAppPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Overview />
      },
      {
        path: "app/:appId",
        element: <DynamicAppPage />
      },
      {
        path: "settings",
        element: <SettingsPage />
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />
  }
]);