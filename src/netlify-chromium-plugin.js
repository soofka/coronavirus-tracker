const NetlifyChromiumPlugin = {
  name: 'netlify-chromium-plugin',
  onInstall: () => {
    console.log('[NetlifyChromiumPlugin]: Installing Chromium');

    try {
      require('child_process').execSync(
        'npm list chromium || npm install chromium',
        {
          cwd: process.cwd(),
          stdio: 'inherit',
        },
      );

      const { path } = require('chromium');
      process.env.CHROME_PATH = path;

      console.log('[NetlifyChromiumPlugin]: Chromium installation finished with SUCCESS', process.env.CHROME_PATH);
    } catch(error) {
      console.log('[NetlifyChromiumPlugin]: Chromium installation finished with FAILURE', error);
    }
  },
};

module.exports = NetlifyChromiumPlugin;
