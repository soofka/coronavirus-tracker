import { h, createContext } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';

const SWPostMessageContext = createContext();

export const SWPostMessageProvider = ({ children }) => {
  const [listeners, setListeners] = useState({});
  const addSWPostMessageListener = (url, action) => setListeners({ ...listeners, [url]: action });

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'refresh') {
            Object.keys(listeners).forEach((url) => {
              if (message.url === url) {
                listeners[url]();
                delete listeners[url];
              }
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }, [listeners]);

  return (
    <SWPostMessageContext.Provider value={{ addSWPostMessageListener }}>
      {children}
    </SWPostMessageContext.Provider>
  );
};

export const useSWPostMessage = () => useContext(SWPostMessageContext);
