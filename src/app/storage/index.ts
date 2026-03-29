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

// Export des adapters pour usage direct si nécessaire
export { LocalStorageAdapter } from './localStorage.adapter';
export { PostgreSQLAdapter } from './postgresql.adapter';
export type { StorageAdapter } from './adapter';
