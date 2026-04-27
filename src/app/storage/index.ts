import { StorageAdapter } from './adapter';
import { LocalStorageAdapter } from './localStorage.adapter';
import { PostgreSQLAdapter } from './postgresql.adapter';
import { isDatabaseEnabled } from '../config/database';

/**
 * Factory qui retourne le bon adapter selon la configuration
 * - Si PostgreSQL est activé et configuré → PostgreSQLAdapter
 * - Sinon → LocalStorageAdapter (mode frontend-only)
 */
export function createStorageAdapter<T>(
  key: string,
  tableName?: string
): StorageAdapter<T> {
  if (isDatabaseEnabled() && tableName) {
    return new PostgreSQLAdapter<T>(tableName);
  }

  return new LocalStorageAdapter<T>(key);
}

/**
 * Retourne un adapter générique (utilisé principalement avec localStorage)
 * Pour des besoins spécifiques, utilisez createStorageAdapter avec les bons paramètres
 */
export function getStorageAdapter(): {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
} {
  return {
    async getItem<T>(key: string): Promise<T | null> {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    },
    async setItem<T>(key: string, value: T): Promise<void> {
      localStorage.setItem(key, JSON.stringify(value));
    },
    async removeItem(key: string): Promise<void> {
      localStorage.removeItem(key);
    },
  };
}

// Export des adapters pour usage direct si nécessaire
export { LocalStorageAdapter } from './localStorage.adapter';
export { PostgreSQLAdapter } from './postgresql.adapter';
export type { StorageAdapter } from './adapter';
