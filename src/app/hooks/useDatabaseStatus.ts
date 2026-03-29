import { useState, useEffect } from 'react';
import { isDatabaseEnabled } from '../config/database';

/**
 * Hook pour vérifier le statut de la base de données
 */
export function useDatabaseStatus() {
  const [enabled, setEnabled] = useState(isDatabaseEnabled());
  const [mode, setMode] = useState<'localStorage' | 'postgresql'>(
    enabled ? 'postgresql' : 'localStorage'
  );

  useEffect(() => {
    // Vérifier périodiquement si la config a changé
    const interval = setInterval(() => {
      const isEnabled = isDatabaseEnabled();
      setEnabled(isEnabled);
      setMode(isEnabled ? 'postgresql' : 'localStorage');
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    enabled,
    mode,
    isLocalStorage: mode === 'localStorage',
    isPostgreSQL: mode === 'postgresql',
  };
}
