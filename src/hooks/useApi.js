import { useState, useEffect, useCallback } from "react";

export function useApi(apiFunc, params = [], options = { immediate: true }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    console.log("Executing API function with args:", args);
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...args);
      setData(response);
      console.log("API response:", response);
      return response;
    } catch (err) {
      console.error("API error:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    console.log("useApi useEffect triggered with params:", params, "and options:", options);
    if (options.immediate) {
      execute(...params);
    }
  }, []);

  return { data, loading, error, refetch: execute , setData };
}