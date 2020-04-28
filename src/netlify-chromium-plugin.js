const fs = require('fs');

const DEFAULT_CHROMIUM_PATH = '/opt/build/repo/node_modules/chromium/lib/chromium';
const CHROME_PATH_ENV_VAR_NAME = 'CHROME_PATH';

const NetlifyChromiumPlugin = {
  name: 'netlify-chromium-plugin',
  onInstall: () => {
    if (!process.env[CHROME_PATH_ENV_VAR_NAME]) {
      process.env[CHROME_PATH_ENV_VAR_NAME] = DEFAULT_CHROMIUM_PATH;
    }

    if (!fs.existsSync(DEFAULT_CHROMIUM_PATH)) {
      require('child_process').execSync(
        'npm install chromium',
        {
          cwd: process.cwd(),
          stdio: 'inherit',
        },
      );
    }
  },
};

module.exports = NetlifyChromiumPlugin;
