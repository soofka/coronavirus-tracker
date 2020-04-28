const NetlifyChromiumPlugin = {
  onInstall: ({ inputs, utils }) => {
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

      if (inputs.setChromiumPathInEnv) {
        process.env.CHROME_PATH = path;
      }

      console.log('[NetlifyChromiumPlugin]: Chromium installation finished with SUCCESS', path);
    } catch(error) {
      console.log('[NetlifyChromiumPlugin]: Chromium installation finished with FAILURE');

      const failFunc = inputs.failBuildOnError ? utils.build.failBuild : utils.build.failPlugin;
      failFunc('Error during Chromium installation', { error });
    }
  },
};

module.exports = NetlifyChromiumPlugin;
