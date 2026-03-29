import { StorageAdapter, BaseEntity, generateId, formatDate } from './adapter';
import { getDatabaseConfig } from '../config/database';

/**
 * Implémentation PostgreSQL native du StorageAdapter
 * Utilisé en mode Docker avec base PostgreSQL dédiée
 * 
 * Cette classe communique avec l'API backend Node.js/Express
 * qui fait les requêtes SQL vers PostgreSQL
 */
export class PostgreSQLAdapter<T extends BaseEntity> implements StorageAdapter<T> {
  private tableName: string;
  private apiBaseUrl: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    
    // Récupérer l'URL de l'API depuis la config ou les variables d'environnement
    const config = getDatabaseConfig();
    
    // En mode Docker, l'API est accessible via le nom du service
    // En mode Supabase, utiliser l'URL Supabase REST API
    if (config.supabaseUrl) {
      // Mode Supabase (URL commence par https://xxx.supabase.co)
      this.apiBaseUrl = `${config.supabaseUrl}/rest/v1`;
    } else if (typeof window !== 'undefined' && (window as any).ENV) {
      // Mode Docker - Variables injectées par entrypoint.sh
      const host = (window as any).ENV.POSTGRES_HOST || 'localhost';
      const port = (window as any).ENV.POSTGRES_PORT || 3001;
      this.apiBaseUrl = `http://${host}:${port}/api`;
    } else {
      // Fallback pour développement local
      this.apiBaseUrl = 'http://localhost:3001/api';
    }
  }

  /**
   * Récupère toutes les entrées
   */
  async getAll(): Promise<T[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${this.tableName}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error(`Erreur getAll ${this.tableName}:`, error);
      return [];
    }
  }

  /**
   * Récupère une entrée par ID
   */
  async getById(id: string): Promise<T | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${this.tableName}/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur getById ${this.tableName}:`, error);
      return null;
    }
  }

  /**
   * Crée une nouvelle entrée
   */
  async create(data: Omit<T, 'id' | 'createdAt'>): Promise<T> {
    try {
      const newItem = {
        ...data,
        id: generateId(),
        createdAt: formatDate(),
      };

      const response = await fetch(`${this.apiBaseUrl}/${this.tableName}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur create ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Met à jour une entrée
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const updateData = {
        ...data,
        updatedAt: formatDate(),
      };

      const response = await fetch(`${this.apiBaseUrl}/${this.tableName}/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur update ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Supprime une entrée
   */
  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${this.tableName}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Erreur delete ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Recherche avec filtres
   */
  async query(filters: Partial<T>): Promise<T[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(
        `${this.apiBaseUrl}/${this.tableName}?${params.toString()}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error(`Erreur query ${this.tableName}:`, error);
      return [];
    }
  }

  /**
   * Headers pour les requêtes API
   */
  private getHeaders(): HeadersInit {
    const config = getDatabaseConfig();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Ajouter l'authentification si disponible
    if (config.supabaseAnonKey) {
      headers['apikey'] = config.supabaseAnonKey;
      headers['Authorization'] = `Bearer ${config.supabaseAnonKey}`;
    }

    return headers;
  }
}