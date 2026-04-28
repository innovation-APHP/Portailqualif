import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, Menu, ExternalLink } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useState } from "react";
import { cn } from "./ui/utils";
import { HelpButton } from "./HelpButton";
import { WelcomeTutorial } from "./WelcomeTutorial";
import { DatabaseStatusBadge } from "./DatabaseStatusBadge";
import { useApplications } from "../hooks/useApplications";
import { ApplicationsService } from "../services/applications.service";

export function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { enabledApplications = [], loading } = useApplications();

  const getIconComponent = (iconName: string) => {
    try {
      const Icon = (LucideIcons as any)[iconName];
      return Icon || LucideIcons.Package;
    } catch {
      return LucideIcons.Package;
    }
  };

  const appNavItems = loading ? [] : enabledApplications.map((app) => {
    try {
      return {
        name: app.name,
        href: `/app/${app.id}`,
        icon: getIconComponent(app.icon),
        externalUrl: ApplicationsService.isConfigured(app) ? app.config.baseUrl : null,
      };
    } catch (error) {
      console.error("Error mapping app:", app, error);
      return null;
    }
  }).filter(Boolean);

  const navigation = [
    { name: "Vue d'ensemble", href: "/", icon: LayoutDashboard },
    ...appNavItems,
  ];

  return (
    <>
      <WelcomeTutorial />
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar pour mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-200">
              <h1 className="font-bold text-xl text-gray-900">
                Portail Qualité
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Monitoring & Sécurité
              </p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== "/" && location.pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium flex-1">{item.name}</span>
                    </Link>
                    {item.externalUrl && isActive && (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 ml-8 mt-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ouvrir l'interface
                      </a>
                    )}
                  </div>
                );
              })}

              <div className="pt-4 mt-4 border-t border-gray-200">
                <Link
                  to="/settings"
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    location.pathname === "/settings"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Paramètres</span>
                </Link>
              </div>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Dernière mise à jour: {new Date().toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">
                  {navigation.find(
                    (item) =>
                      location.pathname === item.href ||
                      (item.href !== "/" &&
                        location.pathname.startsWith(item.href))
                  )?.name || location.pathname === "/settings" ? "Paramètres" : "Portail Qualité"}
                </h2>
              </div>
              <DatabaseStatusBadge />
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
          
          {/* Help Button - Floating */}
          <HelpButton />
        </div>
      </div>
    </>
  );
}