import { Application, PREDEFINED_APPS } from "../types/application";
import { getStorageAdapter } from "../storage";

const STORAGE_KEY = "quality_portal_applications";

/**
 * Service pour gérer les applications personnalisées
 */
export class ApplicationsService {
  /**
   * Récupère toutes les applications
   */
  static async getAll(): Promise<Application[]> {
    try {
      const storage = getStorageAdapter();
      const apps = await storage.getItem<Application[]>(STORAGE_KEY);

      if (!apps || apps.length === 0) {
        // Initialiser avec les applications prédéfinies
        const defaultApps = PREDEFINED_APPS.map((app, index) => ({
          ...app,
          id: `app-${index + 1}`,
          config: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        await storage.setItem(STORAGE_KEY, defaultApps);
        return defaultApps;
      }

      return apps.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error("Erreur lors du chargement des applications:", error);
      return [];
    }
  }

  /**
   * Récupère une application par son ID
   */
  static async getById(id: string): Promise<Application | null> {
    const apps = await this.getAll();
    return apps.find((app) => app.id === id) || null;
  }

  /**
   * Récupère toutes les applications actives
   */
  static async getEnabled(): Promise<Application[]> {
    const apps = await this.getAll();
    return apps.filter((app) => app.enabled);
  }

  /**
   * Crée une nouvelle application
   */
  static async create(app: Omit<Application, "id" | "createdAt" | "updatedAt">): Promise<Application> {
    const apps = await this.getAll();
    const newApp: Application = {
      ...app,
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    apps.push(newApp);
    const storage = getStorageAdapter();
    await storage.setItem(STORAGE_KEY, apps);

    return newApp;
  }

  /**
   * Met à jour une application existante
   */
  static async update(id: string, updates: Partial<Application>): Promise<Application | null> {
    const apps = await this.getAll();
    const index = apps.findIndex((app) => app.id === id);

    if (index === -1) {
      return null;
    }

    apps[index] = {
      ...apps[index],
      ...updates,
      id, // Préserver l'ID
      updatedAt: new Date().toISOString(),
    };

    const storage = getStorageAdapter();
    await storage.setItem(STORAGE_KEY, apps);

    return apps[index];
  }

  /**
   * Supprime une application
   */
  static async delete(id: string): Promise<boolean> {
    const apps = await this.getAll();
    const filtered = apps.filter((app) => app.id !== id);

    if (filtered.length === apps.length) {
      return false; // Application non trouvée
    }

    const storage = getStorageAdapter();
    await storage.setItem(STORAGE_KEY, filtered);
    return true;
  }

  /**
   * Active/désactive une application
   */
  static async toggleEnabled(id: string): Promise<Application | null> {
    const app = await this.getById(id);
    if (!app) {
      return null;
    }

    return this.update(id, { enabled: !app.enabled });
  }

  /**
   * Met à jour la configuration d'une application
   */
  static async updateConfig(id: string, config: Record<string, string>): Promise<Application | null> {
    return this.update(id, { config });
  }

  /**
   * Réorganise l'ordre des applications
   */
  static async reorder(appIds: string[]): Promise<void> {
    const apps = await this.getAll();
    const reordered = apps.map((app) => {
      const newOrder = appIds.indexOf(app.id);
      return {
        ...app,
        order: newOrder === -1 ? app.order : newOrder,
      };
    });

    const storage = getStorageAdapter();
    await storage.setItem(STORAGE_KEY, reordered);
  }

  /**
   * Vérifie si une application est correctement configurée
   */
  static isConfigured(app: Application): boolean {
    return app.configFields
      .filter((field) => field.required)
      .every((field) => {
        const value = app.config[field.key];
        return value && value.trim() !== "" && !value.includes("example.com") && !value.includes("YOUR_");
      });
  }

  /**
   * Réinitialise toutes les applications aux valeurs par défaut
   */
  static async reset(): Promise<void> {
    const storage = getStorageAdapter();
    await storage.removeItem(STORAGE_KEY);
  }
}
