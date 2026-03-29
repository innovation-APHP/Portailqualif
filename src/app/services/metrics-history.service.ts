import { BaseEntity } from '../storage/adapter';
import { createStorageAdapter } from '../storage';

/**
 * Snapshot des métriques à un instant T
 * Permet de créer un historique et des tendances
 */
export interface MetricSnapshot extends BaseEntity {
  source: 'sonarqube' | 'zap' | 'wazuh';
  projectKey?: string; // Pour SonarQube
  metricType: string;  // bugs, vulnerabilities, coverage, etc.
  value: number;
  rating?: string;     // A, B, C, D, E
  metadata?: Record<string, any>; // Données supplémentaires
}

/**
 * Service de gestion de l'historique des métriques
 */
export class MetricsHistoryService {
  private adapter = createStorageAdapter<MetricSnapshot>(
    'metrics_history',
    'metrics_snapshots'
  );

  /**
   * Crée un snapshot des métriques actuelles
   */
  async createSnapshot(
    source: MetricSnapshot['source'],
    metricType: string,
    value: number,
    options?: {
      projectKey?: string;
      rating?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<MetricSnapshot> {
    return this.adapter.create({
      source,
      projectKey: options?.projectKey,
      metricType,
      value,
      rating: options?.rating,
      metadata: options?.metadata,
    });
  }

  /**
   * Récupère l'historique pour une source spécifique
   */
  async getHistory(
    source: MetricSnapshot['source'],
    options?: {
      projectKey?: string;
      metricType?: string;
      days?: number;
    }
  ): Promise<MetricSnapshot[]> {
    const all = await this.adapter.getAll();
    
    return all.filter((snapshot) => {
      // Filtre par source
      if (snapshot.source !== source) return false;
      
      // Filtre par projet si spécifié
      if (options?.projectKey && snapshot.projectKey !== options.projectKey) {
        return false;
      }
      
      // Filtre par type de métrique si spécifié
      if (options?.metricType && snapshot.metricType !== options.metricType) {
        return false;
      }
      
      // Filtre par date si spécifié
      if (options?.days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - options.days);
        const snapshotDate = new Date(snapshot.createdAt);
        if (snapshotDate < cutoffDate) return false;
      }
      
      return true;
    });
  }

  /**
   * Calcule la tendance d'une métrique (hausse, baisse, stable)
   */
  async calculateTrend(
    source: MetricSnapshot['source'],
    metricType: string,
    projectKey?: string
  ): Promise<{
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  } | null> {
    const history = await this.getHistory(source, {
      projectKey,
      metricType,
      days: 30,
    });

    if (history.length < 2) return null;

    const current = history[0].value;
    const previous = history[1].value;
    const change = current - previous;
    const percentChange = previous !== 0 ? (change / previous) * 100 : 0;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(percentChange) > 5) {
      trend = change > 0 ? 'up' : 'down';
    }

    return {
      current,
      previous,
      change: percentChange,
      trend,
    };
  }

  /**
   * Nettoie les vieux snapshots (garde les N derniers jours)
   */
  async cleanup(daysToKeep: number = 90): Promise<void> {
    const all = await this.adapter.getAll();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const toDelete = all.filter((snapshot) => {
      const snapshotDate = new Date(snapshot.createdAt);
      return snapshotDate < cutoffDate;
    });

    await Promise.all(
      toDelete.map((snapshot) => this.adapter.delete(snapshot.id))
    );
  }
}

// Instance singleton
export const metricsHistoryService = new MetricsHistoryService();
