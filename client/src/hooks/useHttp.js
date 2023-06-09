import { useState, useCallback } from 'react';

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (requestConfig, handleResponse, handleError) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(requestConfig.url, {
          method: requestConfig.method ? requestConfig.method : 'GET',
          withCredentials: requestConfig.withCredentials,
          credentials: requestConfig.credentials,
          headers: requestConfig.headers ? requestConfig.headers : {},
          body: requestConfig.body ? JSON.stringify(requestConfig.body) : null
        });

        if (!response.ok) {
          const res = await response.json();
          // Handling JSON error response
          setIsLoading(false);
          if (handleError) {
            handleError(req.message);
          }
          return setError(res.message);
        }

        let resData;

        if (requestConfig.method !== 'DELETE') {
          resData = await response.json();
        }

        if (resData) {
          handleResponse(resData);
        } else {
          handleResponse();
        }
      } catch (error) {
        // The catch block is also run if you attempt to parse JSON via response.json()
        // while the response we get from the backend is in a different format.
        const errorMessage = 'Something went wrong!';
        setError(errorMessage);
        if (handleError) {
          handleError(errorMessage);
        }
      }
      setIsLoading(false);
    },
    []
  );

  const dismissErrorHandler = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    dismissErrorHandler,
    sendRequest
  };
};

export default useHttp;
