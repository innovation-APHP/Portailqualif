import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { CheckCircle, AlertCircle, Lock } from "lucide-react";
import { toast } from "sonner";

export function AdminPasswordManager() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (newUsername && newUsername.length < 3) {
      toast.error("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (!newUsername && !newPassword) {
      toast.error("Veuillez renseigner au moins un champ à modifier");
      return;
    }

    // Vérifier le mot de passe actuel
    const storedPassword = localStorage.getItem("quality_portal_admin_password") || "admin123";
    if (currentPassword !== storedPassword) {
      toast.error("Mot de passe actuel incorrect");
      return;
    }

    // Sauvegarder les nouvelles valeurs
    if (newUsername) {
      localStorage.setItem("quality_portal_admin_username", newUsername);
    }
    if (newPassword) {
      localStorage.setItem("quality_portal_admin_password", newPassword);
    }

    // Reset form
    setCurrentPassword("");
    setNewUsername("");
    setNewPassword("");
    setConfirmPassword("");
    setShowSuccess(true);

    const message = newUsername && newPassword
      ? "Nom d'utilisateur et mot de passe modifiés"
      : newUsername
      ? "Nom d'utilisateur modifié"
      : "Mot de passe modifié";

    toast.success(message + " avec succès");

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Lock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <CardTitle>Identifiants administrateur</CardTitle>
            <CardDescription>
              Modifiez le nom d'utilisateur et/ou le mot de passe pour sécuriser l'accès
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">Mot de passe modifié avec succès</span>
          </div>
        )}

        <form onSubmit={handleChangeCredentials} className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              Vous pouvez modifier le nom d'utilisateur et/ou le mot de passe. Laissez vide les champs que vous ne souhaitez pas changer.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-password">Mot de passe actuel *</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Entrez le mot de passe actuel"
              required
            />
          </div>

          <div className="border-t pt-4 space-y-4">
            <h3 className="font-medium text-sm text-gray-900">Nouvelles valeurs</h3>

            <div className="space-y-2">
              <Label htmlFor="new-username">Nouveau nom d'utilisateur (optionnel)</Label>
              <Input
                id="new-username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Minimum 3 caractères"
              />
              <p className="text-xs text-gray-500">
                Actuel : <code className="bg-gray-100 px-1 rounded">
                  {localStorage.getItem("quality_portal_admin_username") || "admin"}
                </code>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe (optionnel)</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Retapez le nouveau mot de passe"
                disabled={!newPassword}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Enregistrer les modifications
          </Button>
        </form>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800">
              <strong>Important :</strong> Conservez ce mot de passe en lieu sûr. Si vous le perdez,
              vous devrez réinitialiser les données locales du navigateur.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
