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
        console.log(`Setting environmental variable ${key} = ${ENV_VARS[key]}`);
        process.env[key] = ENV_VARS[key];
      }
    });

    if (!fs.existsSync(process.env.CHROME_PATH)) {
      console.log('Installing chromium and chrome-launcher');
      require('child_process').execSync(
        'npm install chromium chrome-launcher',
        {
          cwd: process.cwd(),
          stdio: 'inherit',
        },
      );

      console.log('Testing started');
      const { Launcher, launch, killAll } = require('chrome-launcher');

      console.log('Installations:', Launcher.getInstallations());

      return launch({ startingUrl: 'https://google.com' })
        .then(({ port, pid, process }) => {
          console.log(`Chrome is up (port: ${port}, pid: ${pid}, process: ${JSON.stringify(process)})`);
          killAll().then(() => {
            console.log('Killed all Chrome instances');
            console.log('Testing success');
            // process.exit(0);
          });
        })
        .catch((error) => {
          console.log('Testing failure:', error);
          // process.exit(1);
        });
    }
  },
};

module.exports = NetlifyChromiumPlugin;
