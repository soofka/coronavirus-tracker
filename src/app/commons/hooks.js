import { useState } from 'preact/hooks';

export const useFetch = (
  baseUrl = '',
  validateData = () => true,
  normalizeData = (data) => data,
) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = (url = '') => {
    setLoading(true);
    return window.fetch(`${baseUrl}${url}`)
      .then((response) => {
        if (response) {
          if (response.ok) {
            return response.json();
          }
          if (response.statusText) {
            throw response.statusText;
          }
        }
        throw `Response error: ${JSON.stringify(response)}`;
      })
      .then((data) => {
        if (validateData(data)) {
          return setData(normalizeData(data));
        }
        throw `Invalid data: ${JSON.stringify(data)}`;
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  return { data, error, loading, fetch };
};
