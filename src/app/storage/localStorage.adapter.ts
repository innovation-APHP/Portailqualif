import { StorageAdapter, BaseEntity, generateId, formatDate } from './adapter';

/**
 * Implémentation LocalStorage du StorageAdapter
 * Utilisé en mode frontend-only (pas de base de données)
 */
export class LocalStorageAdapter<T extends BaseEntity> implements StorageAdapter<T> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = `quality_portal_${storageKey}`;
  }

  // Récupère toutes les données depuis localStorage
  private getData(): T[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${this.storageKey}:`, error);
      return [];
    }
  }

  // Sauvegarde les données dans localStorage
  private saveData(data: T[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${this.storageKey}:`, error);
    }
  }

  async getAll(): Promise<T[]> {
    return this.getData();
  }

  async getById(id: string): Promise<T | null> {
    const data = this.getData();
    return data.find((item) => item.id === id) || null;
  }

  async create(data: Omit<T, 'id' | 'createdAt'>): Promise<T> {
    const items = this.getData();
    const newItem = {
      ...data,
      id: generateId(),
      createdAt: formatDate(),
    } as T;
    
    items.push(newItem);
    this.saveData(items);
    
    return newItem;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const items = this.getData();
    const index = items.findIndex((item) => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item avec l'ID ${id} non trouvé`);
    }
    
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: formatDate(),
    };
    
    this.saveData(items);
    return items[index];
  }

  async delete(id: string): Promise<void> {
    const items = this.getData();
    const filtered = items.filter((item) => item.id !== id);
    this.saveData(filtered);
  }

  async query(filters: Partial<T>): Promise<T[]> {
    const items = this.getData();
    
    return items.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        return item[key as keyof T] === value;
      });
    });
  }
}
