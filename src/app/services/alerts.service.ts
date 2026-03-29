import { BaseEntity } from '../storage/adapter';
import { createStorageAdapter } from '../storage';

/**
 * Alerte personnalisée définie par l'utilisateur
 */
export interface Alert extends BaseEntity {
  name: string;
  description?: string;
  source: 'sonarqube' | 'zap' | 'wazuh';
  projectKey?: string;
  
  // Condition de déclenchement
  condition: {
    metric: string;      // bugs, vulnerabilities, coverage, etc.
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
    threshold: number;
  };
  
  // Actions
  enabled: boolean;
  notificationChannels?: ('email' | 'slack' | 'webhook')[];
  
  // Métadonnées
  lastTriggered?: string;
  triggerCount: number;
}

/**
 * Historique de déclenchement d'alerte
 */
export interface AlertTrigger extends BaseEntity {
  alertId: string;
  alertName: string;
  metricValue: number;
  threshold: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

/**
 * Service de gestion des alertes
 */
export class AlertsService {
  private alertsAdapter = createStorageAdapter<Alert>(
    'alerts',
    'alerts'
  );
  
  private triggersAdapter = createStorageAdapter<AlertTrigger>(
    'alert_triggers',
    'alert_triggers'
  );

  /**
   * Crée une nouvelle alerte
   */
  async createAlert(alert: Omit<Alert, 'id' | 'createdAt' | 'triggerCount'>): Promise<Alert> {
    return this.alertsAdapter.create({
      ...alert,
      triggerCount: 0,
    });
  }

  /**
   * Récupère toutes les alertes
   */
  async getAllAlerts(): Promise<Alert[]> {
    return this.alertsAdapter.getAll();
  }

  /**
   * Récupère les alertes actives pour une source
   */
  async getActiveAlerts(source: Alert['source']): Promise<Alert[]> {
    const all = await this.alertsAdapter.getAll();
    return all.filter((alert) => alert.enabled && alert.source === source);
  }

  /**
   * Met à jour une alerte
   */
  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert> {
    return this.alertsAdapter.update(id, updates);
  }

  /**
   * Supprime une alerte
   */
  async deleteAlert(id: string): Promise<void> {
    return this.alertsAdapter.delete(id);
  }

  /**
   * Évalue si une alerte doit être déclenchée
   */
  evaluateCondition(
    condition: Alert['condition'],
    currentValue: number
  ): boolean {
    const { operator, threshold } = condition;
    
    switch (operator) {
      case '>':
        return currentValue > threshold;
      case '<':
        return currentValue < threshold;
      case '>=':
        return currentValue >= threshold;
      case '<=':
        return currentValue <= threshold;
      case '==':
        return currentValue === threshold;
      case '!=':
        return currentValue !== threshold;
      default:
        return false;
    }
  }

  /**
   * Vérifie toutes les alertes pour une métrique donnée
   */
  async checkAlerts(
    source: Alert['source'],
    metricName: string,
    currentValue: number,
    projectKey?: string
  ): Promise<Alert[]> {
    const activeAlerts = await this.getActiveAlerts(source);
    const triggeredAlerts: Alert[] = [];

    for (const alert of activeAlerts) {
      // Vérifie si l'alerte correspond au projet (si spécifié)
      if (projectKey && alert.projectKey && alert.projectKey !== projectKey) {
        continue;
      }

      // Vérifie si l'alerte concerne cette métrique
      if (alert.condition.metric !== metricName) {
        continue;
      }

      // Évalue la condition
      if (this.evaluateCondition(alert.condition, currentValue)) {
        triggeredAlerts.push(alert);

        // Enregistre le déclenchement
        await this.triggerAlert(alert.id, alert.name, currentValue, alert.condition.threshold);
      }
    }

    return triggeredAlerts;
  }

  /**
   * Enregistre un déclenchement d'alerte
   */
  async triggerAlert(
    alertId: string,
    alertName: string,
    metricValue: number,
    threshold: number
  ): Promise<AlertTrigger> {
    // Crée l'entrée de déclenchement
    const trigger = await this.triggersAdapter.create({
      alertId,
      alertName,
      metricValue,
      threshold,
      acknowledged: false,
    });

    // Met à jour l'alerte
    await this.alertsAdapter.update(alertId, {
      lastTriggered: new Date().toISOString(),
      triggerCount: (await this.alertsAdapter.getById(alertId))!.triggerCount + 1,
    });

    return trigger;
  }

  /**
   * Récupère les déclenchements récents
   */
  async getRecentTriggers(days: number = 7): Promise<AlertTrigger[]> {
    const all = await this.triggersAdapter.getAll();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return all.filter((trigger) => {
      const triggerDate = new Date(trigger.createdAt);
      return triggerDate >= cutoffDate;
    });
  }

  /**
   * Accuse réception d'une alerte
   */
  async acknowledgeAlert(
    triggerId: string,
    acknowledgedBy: string
  ): Promise<AlertTrigger> {
    return this.triggersAdapter.update(triggerId, {
      acknowledged: true,
      acknowledgedBy,
      acknowledgedAt: new Date().toISOString(),
    });
  }

  /**
   * Récupère les alertes non accusées
   */
  async getUnacknowledgedTriggers(): Promise<AlertTrigger[]> {
    const all = await this.triggersAdapter.getAll();
    return all.filter((trigger) => !trigger.acknowledged);
  }
}

// Instance singleton
export const alertsService = new AlertsService();
