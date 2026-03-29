import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { Overview } from "./components/Overview";
import { SonarqubePage } from "./components/SonarqubePage";
import { ZapPage } from "./components/ZapPage";
import { WazuhPage } from "./components/WazuhPage";
import { SettingsPage } from "./components/SettingsPage";
import { NotFound } from "./components/NotFound";

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
        path: "sonarqube", 
        element: <SonarqubePage /> 
      },
      { 
        path: "zap", 
        element: <ZapPage /> 
      },
      { 
        path: "wazuh", 
        element: <WazuhPage /> 
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