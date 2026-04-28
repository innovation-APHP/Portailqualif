import { useState } from "react";
import { Application, AppConfigField, AppFieldType } from "../types/application";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";

interface CustomAppFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: Omit<Application, "id" | "createdAt" | "updatedAt">) => void;
}

type AppConnectionType = "url" | "api";

export function CustomAppForm({ isOpen, onClose, onSave }: CustomAppFormProps) {
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [appIcon, setAppIcon] = useState("Package");
  const [connectionType, setConnectionType] = useState<AppConnectionType>("url");
  const [configFields, setConfigFields] = useState<AppConfigField[]>([
    {
      key: "baseUrl",
      label: "URL de l'application",
      type: "url",
      required: true,
      placeholder: "https://example.com",
    },
  ]);

  const iconsList = [
    "Package", "Box", "Layers", "Code", "Code2", "Terminal",
    "Shield", "ShieldCheck", "Lock", "Eye", "Activity",
    "FileText", "FileCheck", "FileCode", "File", "Folder",
    "Server", "Database", "Cloud", "Cpu", "HardDrive",
    "BarChart", "PieChart", "TrendingUp", "LineChart", "AreaChart"
  ];

  const fieldTypeOptions: { value: AppFieldType; label: string }[] = [
    { value: "text", label: "Texte" },
    { value: "url", label: "URL" },
    { value: "password", label: "Mot de passe" },
    { value: "apiKey", label: "Clé API" },
  ];

  const addConfigField = () => {
    setConfigFields([
      ...configFields,
      {
        key: `field${configFields.length + 1}`,
        label: "Nouveau champ",
        type: "text",
        required: false,
        placeholder: "",
      },
    ]);
  };

  const removeConfigField = (index: number) => {
    setConfigFields(configFields.filter((_, i) => i !== index));
  };

  const updateConfigField = (index: number, updates: Partial<AppConfigField>) => {
    const updated = [...configFields];
    updated[index] = { ...updated[index], ...updates };
    setConfigFields(updated);
  };

  const handleConnectionTypeChange = (type: AppConnectionType) => {
    setConnectionType(type);

    if (type === "url") {
      // Configuration simple pour URL
      setConfigFields([
        {
          key: "baseUrl",
          label: "URL de l'application",
          type: "url",
          required: true,
          placeholder: "https://example.com",
          helpText: "URL de l'interface web de l'application",
        },
      ]);
    } else {
      // Configuration pour API
      setConfigFields([
        {
          key: "baseUrl",
          label: "URL de l'API",
          type: "url",
          required: true,
          placeholder: "https://api.example.com",
          helpText: "URL de base de l'API",
        },
        {
          key: "apiKey",
          label: "Clé API",
          type: "apiKey",
          required: false,
          placeholder: "YOUR_API_KEY",
          helpText: "Clé d'authentification pour l'API",
        },
      ]);
    }
  };

  const handleSave = () => {
    // Validation
    if (!appName.trim()) {
      toast.error("Le nom de l'application est requis");
      return;
    }

    if (!appDescription.trim()) {
      toast.error("La description est requise");
      return;
    }

    if (configFields.length === 0) {
      toast.error("Au moins un champ de configuration est requis");
      return;
    }

    // Vérifier les champs de configuration
    for (const field of configFields) {
      if (!field.key.trim() || !field.label.trim()) {
        toast.error("Tous les champs de configuration doivent avoir une clé et un libellé");
        return;
      }
    }

    const newApp: Omit<Application, "id" | "createdAt" | "updatedAt"> = {
      name: appName,
      description: appDescription,
      icon: appIcon,
      enabled: true,
      order: 999,
      config: {},
      configFields: configFields,
    };

    onSave(newApp);

    // Reset form
    setAppName("");
    setAppDescription("");
    setAppIcon("Package");
    setConnectionType("url");
    setConfigFields([
      {
        key: "baseUrl",
        label: "URL de l'application",
        type: "url",
        required: true,
        placeholder: "https://example.com",
      },
    ]);
  };

  const IconPreview = (LucideIcons as any)[appIcon] || LucideIcons.Package;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une application personnalisée</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle application avec une configuration sur mesure
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-900">Informations de base</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Nom de l'application *</Label>
                <Input
                  id="app-name"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Ex: Grafana, Jenkins, GitLab..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="app-icon">Icône</Label>
                <Select value={appIcon} onValueChange={setAppIcon}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <IconPreview className="w-4 h-4" />
                      <span>{appIcon}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {iconsList.map((icon) => {
                      const Icon = (LucideIcons as any)[icon];
                      return (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{icon}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="app-description">Description *</Label>
              <Input
                id="app-description"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                placeholder="Décrivez brièvement cette application..."
              />
            </div>
          </div>

          {/* Type de connexion */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-900">Type de connexion</h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleConnectionTypeChange("url")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  connectionType === "url"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    connectionType === "url" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <LucideIcons.Globe className={`w-5 h-5 ${
                      connectionType === "url" ? "text-blue-600" : "text-gray-600"
                    }`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">URL Simple</div>
                    <div className="text-xs text-gray-500">Interface web uniquement</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleConnectionTypeChange("api")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  connectionType === "api"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    connectionType === "api" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <LucideIcons.Database className={`w-5 h-5 ${
                      connectionType === "api" ? "text-blue-600" : "text-gray-600"
                    }`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">API REST</div>
                    <div className="text-xs text-gray-500">Connexion via API</div>
                  </div>
                </div>
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                {connectionType === "url" ? (
                  <>
                    <strong>URL Simple :</strong> Pour les applications où vous voulez seulement afficher un lien
                    vers l'interface web (ex: Grafana, Jenkins)
                  </>
                ) : (
                  <>
                    <strong>API REST :</strong> Pour les applications dont vous voulez récupérer des données via API
                    (ex: API custom, webhook)
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Champs de configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-gray-900">Champs de configuration</h3>
              <Button type="button" variant="outline" size="sm" onClick={addConfigField}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un champ
              </Button>
            </div>

            <div className="space-y-3">
              {configFields.map((field, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Champ {index + 1}</Badge>
                    {configFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConfigField(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Clé (technique)</Label>
                      <Input
                        value={field.key}
                        onChange={(e) => updateConfigField(index, { key: e.target.value })}
                        placeholder="Ex: apiKey, token, url..."
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Libellé (affiché)</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateConfigField(index, { label: e.target.value })}
                        placeholder="Ex: Clé API, Token d'accès..."
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value: AppFieldType) => updateConfigField(index, { type: value })}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Placeholder</Label>
                      <Input
                        value={field.placeholder || ""}
                        onChange={(e) => updateConfigField(index, { placeholder: e.target.value })}
                        placeholder="Texte d'exemple..."
                        className="text-sm"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <Label className="text-xs">Texte d'aide (optionnel)</Label>
                      <Input
                        value={field.helpText || ""}
                        onChange={(e) => updateConfigField(index, { helpText: e.target.value })}
                        placeholder="Instructions pour l'utilisateur..."
                        className="text-sm"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`required-${index}`}
                        checked={field.required}
                        onChange={(e) => updateConfigField(index, { required: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor={`required-${index}`} className="text-xs cursor-pointer">
                        Champ obligatoire
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Créer l'application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
