/**
 * Service de Migration - localStorage vers PostgreSQL
 * Portail Qualité
 */

import { Pool, PoolClient } from 'pg';

interface AdminData {
  username: string;
  password: string;
}

interface ConfigField {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
}

interface ApplicationData {
  id?: string;
  name: string;
  description?: string;
  icon: string;
  enabled: boolean;
  connectionType?: string;
  externalUrl?: string;
  configFields?: ConfigField[];
  config?: Record<string, string>;
}

interface LocalStorageData {
  admin?: AdminData;
  applications?: ApplicationData[];
}

interface MigrationResult {
  success: boolean;
  migrated: {
    credentials: number;
    applications: number;
    configFields: number;
    configValues: number;
  };
  errors: Array<{
    application?: string;
    phase?: string;
    error: string;
  }>;
}

interface AppMigrationResult {
  application: number;
  configFields: number;
  configValues: number;
}

class MigrationService {
  private pool: Pool;

  constructor(dbConfig: any) {
    this.pool = new Pool(dbConfig);
  }

  /**
   * Exécute la migration complète depuis les données localStorage
   */
  async migrate(localStorageData: LocalStorageData): Promise<MigrationResult> {
    const client = await this.pool.connect();
    const results: MigrationResult = {
      success: false,
      migrated: {
        credentials: 0,
        applications: 0,
        configFields: 0,
        configValues: 0
      },
      errors: []
    };

    try {
      // Démarrer une transaction
      await client.query('BEGIN');

      // 1. Migrer les identifiants admin
      if (localStorageData.admin) {
        const credentialsResult = await this.migrateCredentials(
          client,
          localStorageData.admin
        );
        results.migrated.credentials = credentialsResult;
      }

      // 2. Migrer les applications
      if (localStorageData.applications && Array.isArray(localStorageData.applications)) {
        for (const app of localStorageData.applications) {
          try {
            const appResult = await this.migrateApplication(client, app);
            results.migrated.applications += appResult.application;
            results.migrated.configFields += appResult.configFields;
            results.migrated.configValues += appResult.configValues;
          } catch (err: any) {
            results.errors.push({
              application: app.name,
              error: err.message
            });
          }
        }
      }

      // Valider la transaction
      await client.query('COMMIT');
      results.success = true;

    } catch (error: any) {
      // Annuler la transaction en cas d'erreur
      await client.query('ROLLBACK');
      results.success = false;
      results.errors.push({
        phase: 'transaction',
        error: error.message
      });
    } finally {
      client.release();
    }

    return results;
  }

  /**
   * Migre les identifiants administrateur
   */
  private async migrateCredentials(client: PoolClient, adminData: AdminData): Promise<number> {
    const { username, password } = adminData;

    // Vérifier si déjà existant
    const checkQuery = 'SELECT id FROM admin_credentials WHERE username = $1';
    const checkResult = await client.query(checkQuery, [username]);

    if (checkResult.rows.length > 0) {
      // Mise à jour
      const updateQuery = `
        UPDATE admin_credentials
        SET password = $1, updated_at = CURRENT_TIMESTAMP
        WHERE username = $2
        RETURNING id
      `;
      await client.query(updateQuery, [password, username]);
    } else {
      // Insertion
      const insertQuery = `
        INSERT INTO admin_credentials (username, password)
        VALUES ($1, $2)
        RETURNING id
      `;
      await client.query(insertQuery, [username, password]);
    }

    return 1;
  }

  /**
   * Migre une application complète
   */
  private async migrateApplication(
    client: PoolClient,
    appData: ApplicationData
  ): Promise<AppMigrationResult> {
    const result: AppMigrationResult = {
      application: 0,
      configFields: 0,
      configValues: 0
    };

    // 1. Insérer ou mettre à jour l'application
    const appId = await this.upsertApplication(client, appData);
    result.application = 1;

    // 2. Insérer les champs de configuration
    if (appData.configFields && Array.isArray(appData.configFields)) {
      // Supprimer les anciens champs
      await client.query(
        'DELETE FROM application_config_fields WHERE application_id = $1',
        [appId]
      );

      // Insérer les nouveaux champs
      for (let i = 0; i < appData.configFields.length; i++) {
        const field = appData.configFields[i];
        await this.insertConfigField(client, appId, field, i);
        result.configFields++;
      }
    }

    // 3. Insérer les valeurs de configuration
    if (appData.config && typeof appData.config === 'object') {
      // Supprimer les anciennes valeurs
      await client.query(
        'DELETE FROM application_config WHERE application_id = $1',
        [appId]
      );

      // Insérer les nouvelles valeurs
      for (const [key, value] of Object.entries(appData.config)) {
        await this.insertConfigValue(client, appId, key, value);
        result.configValues++;
      }
    }

    return result;
  }

  /**
   * Insère ou met à jour une application
   */
  private async upsertApplication(client: PoolClient, appData: ApplicationData): Promise<string> {
    const {
      id,
      name,
      description,
      icon,
      enabled,
      connectionType,
      externalUrl
    } = appData;

    // Vérifier si l'application existe déjà (par ID ou nom)
    let checkQuery: string;
    let checkParams: any[];

    if (id) {
      checkQuery = 'SELECT id FROM applications WHERE id = $1';
      checkParams = [id];
    } else {
      checkQuery = 'SELECT id FROM applications WHERE name = $1';
      checkParams = [name];
    }

    const checkResult = await client.query(checkQuery, checkParams);

    if (checkResult.rows.length > 0) {
      // Mise à jour
      const appId = checkResult.rows[0].id;
      const updateQuery = `
        UPDATE applications
        SET name = $1,
            description = $2,
            icon = $3,
            enabled = $4,
            connection_type = $5,
            external_url = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING id
      `;
      await client.query(updateQuery, [
        name,
        description,
        icon,
        enabled,
        connectionType,
        externalUrl,
        appId
      ]);
      return appId;
    } else {
      // Insertion avec ID spécifique si fourni
      let insertQuery: string;
      let insertParams: any[];

      if (id) {
        insertQuery = `
          INSERT INTO applications (id, name, description, icon, enabled, connection_type, external_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `;
        insertParams = [id, name, description, icon, enabled, connectionType, externalUrl];
      } else {
        insertQuery = `
          INSERT INTO applications (name, description, icon, enabled, connection_type, external_url)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `;
        insertParams = [name, description, icon, enabled, connectionType, externalUrl];
      }

      const result = await client.query(insertQuery, insertParams);
      return result.rows[0].id;
    }
  }

  /**
   * Insère un champ de configuration
   */
  private async insertConfigField(
    client: PoolClient,
    appId: string,
    field: ConfigField,
    order: number
  ): Promise<void> {
    const query = `
      INSERT INTO application_config_fields
        (application_id, field_key, label, field_type, required, placeholder, help_text, field_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    await client.query(query, [
      appId,
      field.key,
      field.label,
      field.type,
      field.required || false,
      field.placeholder || null,
      field.helpText || null,
      order
    ]);
  }

  /**
   * Insère une valeur de configuration
   */
  private async insertConfigValue(
    client: PoolClient,
    appId: string,
    key: string,
    value: string
  ): Promise<void> {
    // Détecter si c'est une donnée sensible
    const sensitiveKeys = ['password', 'apikey', 'token', 'secret', 'key'];
    const isSensitive = sensitiveKeys.some(k => key.toLowerCase().includes(k));

    const query = `
      INSERT INTO application_config (application_id, config_key, config_value, is_sensitive)
      VALUES ($1, $2, $3, $4)
    `;

    await client.query(query, [appId, key, value, isSensitive]);
  }

  /**
   * Vérifie l'état de la migration
   */
  async checkMigrationStatus(): Promise<any> {
    const client = await this.pool.connect();
    try {
      const queries = {
        credentials: 'SELECT COUNT(*) FROM admin_credentials',
        applications: 'SELECT COUNT(*) FROM applications',
        configFields: 'SELECT COUNT(*) FROM application_config_fields',
        configValues: 'SELECT COUNT(*) FROM application_config'
      };

      const results: Record<string, number> = {};
      for (const [key, query] of Object.entries(queries)) {
        const result = await client.query(query);
        results[key] = parseInt(result.rows[0].count);
      }

      return {
        success: true,
        counts: results
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    } finally {
      client.release();
    }
  }

  /**
   * Exporte toutes les données depuis PostgreSQL
   */
  async exportFromDatabase(): Promise<any> {
    const client = await this.pool.connect();
    try {
      // Récupérer les credentials
      const credQuery = 'SELECT username, password FROM admin_credentials ORDER BY id DESC LIMIT 1';
      const credResult = await client.query(credQuery);

      // Récupérer toutes les applications avec leur config
      const appsQuery = 'SELECT * FROM v_applications_full ORDER BY name';
      const appsResult = await client.query(appsQuery);

      return {
        success: true,
        data: {
          admin: credResult.rows[0] || null,
          applications: appsResult.rows
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    } finally {
      client.release();
    }
  }

  /**
   * Ferme le pool de connexions
   */
  async close(): Promise<void> {
    await this.pool.end();
  }
}

export default MigrationService;
