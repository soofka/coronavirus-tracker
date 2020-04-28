const fs = require('fs');

const ENV_VARS = {
  CHROME_PATH: '/opt/build/repo/node_modules/chromium/lib/chromium',
  DISPLAY: ':99.0',
};

const NetlifyChromiumPlugin = {
  name: 'netlify-chromium-plugin',
  onInstall: () => {
    Object.keys(ENV_VARS).forEach((key) => {
      if (!process.env[key]) {
        process.env[key] = ENV_VARS[key];
      }
    });

    if (!fs.existsSync(process.env.CHROME_PATH)) {
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
