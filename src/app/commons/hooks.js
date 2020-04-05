import { useState, useEffect } from 'preact/hooks';

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

  return { data, setData, error, loading, fetch };
};

export const useResize = (ref) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  if (ref.current) {
    setWidth(ref.current.clientWidth);
    setHeight(ref.current.clientHeight);
  }

  useEffect(() => {
    const handleResize = () => {
      setWidth(ref.current.clientWidth);
      setHeight(ref.current.clientHeight);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ref])

  return { width, setWidth, height, setHeight };
};
