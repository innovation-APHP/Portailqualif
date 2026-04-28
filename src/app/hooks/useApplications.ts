import { useState, useEffect, useCallback } from "react";
import { Application } from "../types/application";
import { ApplicationsService } from "../services/applications.service";

/**
 * Hook personnalisé pour gérer les applications
 */
export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les applications au montage
  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apps = await ApplicationsService.getAll();
      setApplications(apps);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement des applications";
      console.error("Erreur lors du chargement des applications:", err);
      setError(errorMessage);
      setApplications([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  /**
   * Crée une nouvelle application
   */
  const createApplication = async (app: Omit<Application, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newApp = await ApplicationsService.create(app);
      await loadApplications();
      return newApp;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
      throw err;
    }
  };

  /**
   * Met à jour une application
   */
  const updateApplication = async (id: string, updates: Partial<Application>) => {
    try {
      const updated = await ApplicationsService.update(id, updates);
      if (updated) {
        await loadApplications();
      }
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      throw err;
    }
  };

  /**
   * Supprime une application
   */
  const deleteApplication = async (id: string) => {
    try {
      const success = await ApplicationsService.delete(id);
      if (success) {
        await loadApplications();
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      throw err;
    }
  };

  /**
   * Active/désactive une application
   */
  const toggleEnabled = async (id: string) => {
    try {
      const updated = await ApplicationsService.toggleEnabled(id);
      if (updated) {
        await loadApplications();
      }
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la modification");
      throw err;
    }
  };

  /**
   * Met à jour la configuration d'une application
   */
  const updateConfig = async (id: string, config: Record<string, string>) => {
    try {
      const updated = await ApplicationsService.updateConfig(id, config);
      if (updated) {
        await loadApplications();
      }
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour de la configuration");
      throw err;
    }
  };

  /**
   * Réorganise l'ordre des applications
   */
  const reorderApplications = async (appIds: string[]) => {
    try {
      await ApplicationsService.reorder(appIds);
      await loadApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la réorganisation");
      throw err;
    }
  };

  /**
   * Réinitialise aux applications par défaut
   */
  const resetApplications = async () => {
    try {
      await ApplicationsService.reset();
      await loadApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la réinitialisation");
      throw err;
    }
  };

  return {
    applications,
    enabledApplications: applications.filter((app) => app.enabled),
    loading,
    error,
    refresh: loadApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    toggleEnabled,
    updateConfig,
    reorderApplications,
    resetApplications,
  };
}
