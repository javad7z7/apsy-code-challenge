import { useState, useEffect } from "react";

// Define a global cache object for storing responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryCache: Record<string, any> = {};

// Define a global object to track active requests
const activeRequests: Record<string, boolean> = {};

// Define the return type of the hook
interface UseCustomQueryReturnType<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

// Custom hook definition
function useFetch<T>(
  queryKey: string,
  fetchFunction: () => Promise<T>
): UseCustomQueryReturnType<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to fetch data
  const fetchData = async () => {
    // Check if there's already an active request with the same queryKey
    if (activeRequests[queryKey]) {
      return; // Skip this request
    }

    setIsLoading(true);
    setError(null);
    activeRequests[queryKey] = true; // Mark this request as active

    try {
      // Check cache first
      if (queryCache[queryKey]) {
        setData(queryCache[queryKey]);
      } else {
        const response = await fetchFunction();
        queryCache[queryKey] = response;
        setData(response);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setIsLoading(false);
      delete activeRequests[queryKey]; // Clear the active request tracking
    }
  };

  // Refetch function to bypass cache
  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    delete queryCache[queryKey]; // Clear cache for this queryKey
    activeRequests[queryKey] = true; // Mark this request as active

    try {
      const response = await fetchFunction();
      queryCache[queryKey] = response;
      setData(response);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setIsLoading(false);
      delete activeRequests[queryKey]; // Clear the active request tracking
    }
  };

  // Fetch data on mount and when queryKey changes
  useEffect(() => {
    fetchData();
  }, [queryKey]);

  return { data, error, isLoading, refetch };
}

export default useFetch;
