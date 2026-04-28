import { useState } from "react";
import type { Application } from "../types/application";
import { PREDEFINED_APPS } from "../types/application";
import { useApplications } from "../hooks/useApplications";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Trash2, Edit, Plus, ExternalLink, Check, X } from "lucide-react";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";

export function ApplicationManager() {
  const { applications, loading, toggleEnabled, updateConfig, deleteApplication, createApplication } = useApplications();
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [configForm, setConfigForm] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newAppTemplate, setNewAppTemplate] = useState<string>("");

  const handleToggle = async (id: string) => {
    try {
      await toggleEnabled(id);
      toast.success("Application mise à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setConfigForm(app.config);
  };

  const handleSaveConfig = async () => {
    if (!editingApp) return;

    try {
      await updateConfig(editingApp.id, configForm);
      toast.success("Configuration sauvegardée");
      setEditingApp(null);
      setConfigForm({});
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
      return;
    }

    try {
      await deleteApplication(id);
      toast.success("Application supprimée");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleCreateFromTemplate = async () => {
    if (!newAppTemplate) return;

    const template = PREDEFINED_APPS.find((app) => app.name === newAppTemplate);
    if (!template) return;

    try {
      await createApplication({
        ...template,
        config: {},
        enabled: false,
      });
      toast.success("Application ajoutée");
      setIsCreating(false);
      setNewAppTemplate("");
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Package;
  };

  const isConfigured = (app: Application) => {
    return app.configFields
      .filter((field) => field.required)
      .every((field) => {
        const value = app.config[field.key];
        return value && value.trim() !== "" && !value.includes("example.com") && !value.includes("YOUR_");
      });
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Gestion des Applications</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ajoutez, configurez ou supprimez les applications de votre portail qualité
          </p>
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une application</DialogTitle>
              <DialogDescription>
                Choisissez une application prédéfinie à ajouter à votre portail
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Application</Label>
                <Select value={newAppTemplate} onValueChange={setNewAppTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une application" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_APPS.map((app) => {
                      const exists = applications.some((a) => a.name === app.name);
                      return (
                        <SelectItem key={app.name} value={app.name} disabled={exists}>
                          {app.name} {exists && "(déjà ajoutée)"}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateFromTemplate} disabled={!newAppTemplate}>
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {applications.map((app) => {
          const Icon = getIconComponent(app.icon);
          const configured = isConfigured(app);

          return (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        {configured ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="w-3 h-3 mr-1" />
                            Configuré
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <X className="w-3 h-3 mr-1" />
                            Non configuré
                          </Badge>
                        )}
                        {app.enabled && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Activé
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{app.description}</CardDescription>
                      {app.externalUrl && (
                        <a
                          href={app.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ouvrir l'interface
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={app.enabled} onCheckedChange={() => handleToggle(app.id)} />
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(app)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(app.id, app.name)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Dialog de configuration */}
      <Dialog open={!!editingApp} onOpenChange={(open) => !open && setEditingApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configurer {editingApp?.name}</DialogTitle>
            <DialogDescription>{editingApp?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {editingApp?.configFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  id={field.key}
                  type={field.type === "password" || field.type === "apiKey" ? "password" : "text"}
                  value={configForm[field.key] || ""}
                  onChange={(e) => setConfigForm({ ...configForm, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                />
                {field.helpText && <p className="text-xs text-gray-500">{field.helpText}</p>}
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditingApp(null)}>
                Annuler
              </Button>
              <Button onClick={handleSaveConfig}>Sauvegarder</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
