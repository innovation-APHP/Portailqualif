import { useState, useEffect } from "react";

interface UseApiDataOptions<T> {
  fetchFn: () => Promise<T>;
  initialData: T;
  refreshInterval?: number; // en millisecondes, optionnel
}

export function useApiData<T>({
  fetchFn,
  initialData,
  refreshInterval,
}: UseApiDataOptions<T>) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("API Error:", err);
      // En cas d'erreur, on garde les données mockées
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Si un intervalle de rafraîchissement est défini
    if (refreshInterval) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}
