import { DatabaseConfigSection } from "./DatabaseConfigSection";
import { ApplicationManager } from "./ApplicationManager";
import { AdminPasswordManager } from "./AdminPasswordManager";
import { DataMigration } from "./DataMigration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Database, AppWindow, Lock, ArrowRightLeft } from "lucide-react";

export function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="font-bold text-2xl text-gray-900">Configuration</h2>
          <p className="text-gray-600 mt-1">
            Gérez vos applications et configurez la base de données
          </p>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <AppWindow className="w-4 h-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Base de données
            </TabsTrigger>
            <TabsTrigger value="migration" className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4" />
              Migration
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Sécurité
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <ApplicationManager />
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <DatabaseConfigSection />
          </TabsContent>

          <TabsContent value="migration" className="space-y-4">
            <DataMigration />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <AdminPasswordManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
