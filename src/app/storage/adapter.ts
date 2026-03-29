// Interface générique pour le stockage de données
// Permet de basculer entre localStorage et PostgreSQL de manière transparente

export interface StorageAdapter<T> {
  // Récupérer toutes les entrées
  getAll(): Promise<T[]>;
  
  // Récupérer une entrée par ID
  getById(id: string): Promise<T | null>;
  
  // Créer une nouvelle entrée
  create(data: Omit<T, 'id' | 'createdAt'>): Promise<T>;
  
  // Mettre à jour une entrée
  update(id: string, data: Partial<T>): Promise<T>;
  
  // Supprimer une entrée
  delete(id: string): Promise<void>;
  
  // Rechercher avec filtres
  query(filters: Partial<T>): Promise<T[]>;
}

// Type de base pour toutes les entités stockées
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// Génère un ID unique
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Formatte une date ISO
export function formatDate(date?: Date): string {
  return (date || new Date()).toISOString();
}
