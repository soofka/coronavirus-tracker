import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { Text } from './Text.jsx';

export const InstallButton = () => {
  const [installPrompt, setInstallPrompt] = useState(undefined);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const enableInstallation = (event) => setInstallPrompt(event);
    window.addEventListener('beforeinstallprompt', enableInstallation);
    return () => window.removeEventListener('beforeinstallprompt', enableInstallation);
  }, []);

  useEffect(() => {
    if (installing && installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice
        .then((choice) => {
          console.log(`User ${choice.outcome} the A2HS prompt`, choice);
          setInstallPrompt(null);
          setInstalling(false);
        });
    }
  }, [installing])

  return installPrompt === null ? null : (
    <button
      disabled={installPrompt === undefined || installing}
      onClick={() => setInstalling(true)}
    >
    💾 <Text label="navigation.install"/>
    </button>
  );
};
