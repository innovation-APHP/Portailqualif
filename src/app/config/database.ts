// Configuration de la base de données PostgreSQL (optionnelle)
// Cette configuration permet d'activer la persistance en base de données
// Si désactivée, l'application utilise localStorage (mode frontend-only)

export interface DatabaseConfig {
  enabled: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

// Configuration par défaut : mode frontend-only
export const DATABASE_CONFIG: DatabaseConfig = {
  enabled: false,
  supabaseUrl: process.env.SUPABASE_URL || undefined,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || undefined,
};

/**
 * Récupère la configuration de la base de données depuis localStorage
 */
export function getDatabaseConfig(): DatabaseConfig {
  try {
    const stored = localStorage.getItem("quality_portal_database_config");
    if (stored) {
      return JSON.parse(stored) as DatabaseConfig;
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la configuration DB:", error);
  }
  return DATABASE_CONFIG;
}

/**
 * Sauvegarde la configuration de la base de données dans localStorage
 */
export function saveDatabaseConfig(config: DatabaseConfig): void {
  try {
    localStorage.setItem(
      "quality_portal_database_config",
      JSON.stringify(config)
    );
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la configuration DB:", error);
  }
}

/**
 * Vérifie si la base de données est activée et configurée
 */
export function isDatabaseEnabled(): boolean {
  const config = getDatabaseConfig();
  return (
    config.enabled &&
    !!config.supabaseUrl &&
    !!config.supabaseAnonKey
  );
}
