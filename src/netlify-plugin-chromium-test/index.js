'use strict';

const PACKAGE_NAME = 'chromium';
const PACKAGE_MANAGERS = [
  {
    name: 'npm',
    installCommand: 'install',
  },
  {
    name: 'yarn',
    installCommand: 'add',
  },
];

const log = (message) => console.log(`[NetlifyChromiumPlugin]: ${message}`);

const getChromiumPath = () => {
  try {
    delete require.cache[require.resolve(PACKAGE_NAME)];
  } catch(error) {}
  
  const { path } = require(PACKAGE_NAME);
  return path;
};

const installChromium = async (runTask, packageManagerName) => {
  const packageManager = PACKAGE_MANAGERS.find((packageManager) => packageManager.name === packageManagerName);

  if (!packageManager) {
    throw new Error(`Invalid package manager: ${packageManagerName} (available package managers: ${PACKAGE_MANAGERS.map((packageManager) => packageManager.name).join(', ')})`);
  }

  const installCommand = `${packageManager.name} ${packageManager.installCommand} ${PACKAGE_NAME}`;
  await runTask(installCommand);
};

const NetlifyChromiumPlugin = {
  onInstall: async ({ inputs, utils }) => {
    log(`Installing Chromium with settings: ${JSON.stringify(inputs)}`);

    try {
      let chromiumPath;

      try {
        chromiumPath = getChromiumPath();
      } catch(requireError) {
        log('Chromium is not available, attempting to download');

        await installChromium(utils.run, inputs.packageManager);
        chromiumPath = getChromiumPath();
      }

      if (inputs.setChromePathInEnv) {
        log(`Setting environmental variable CHROME_PATH to ${chromiumPath}`);
        process.env.CHROME_PATH = chromiumPath;
      }

      log(`Chromium installation finished with SUCCESS (path: ${chromiumPath})`);
    } catch(error) {
      log('Chromium installation finished with FAILURE');

      const failFunc = inputs.failBuildOnError ? utils.build.failBuild : utils.build.failPlugin;
      failFunc('Error during Chromium installation', { error });
    }
  },
};

module.exports = NetlifyChromiumPlugin;
