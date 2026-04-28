import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { Overview } from "./components/Overview";
import { SettingsPage } from "./components/SettingsPage";
import { NotFound } from "./components/NotFound";
import { DynamicAppPage } from "./components/DynamicAppPage";
import { TestPage } from "./components/TestPage";

// Mode debug: décommentez cette ligne pour activer le mode test
// const DEBUG_MODE = true;
const DEBUG_MODE = false;

export const router = DEBUG_MODE
  ? createBrowserRouter([
      {
        path: "/",
        element: <TestPage />,
      },
      {
        path: "*",
        element: <NotFound />
      }
    ])
  : createBrowserRouter([
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