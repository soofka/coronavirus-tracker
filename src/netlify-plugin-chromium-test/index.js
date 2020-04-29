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

const getChromiumPath = () => {
  try {
    delete require.cache[require.resolve(PACKAGE_NAME)];
  } catch(error) {
    console.log('Chromium not found in require cache');
  }
  
  const { path } = require(PACKAGE_NAME);
  return path;
};

const installChromium = async (runTask, packageManagerName) => {
  const packageManager = PACKAGE_MANAGERS.find((packageManager) => packageManager.name === packageManagerName);

  if (!packageManager) {
    throw new Error(`Invalid package manager: ${packageManagerName}
      (available package managers: ${PACKAGE_MANAGERS.map((packageManager) => packageManager.name).join(', ')})`);
  }

  const installCommand = `${packageManager.name} ${packageManager.installCommand} ${PACKAGE_NAME}`;
  await runTask(installCommand);
};

const NetlifyChromiumPlugin = {
  onInstall: async ({ inputs, utils }) => {
    console.log(`[NetlifyChromiumPlugin]: Installing Chromium with settings: ${JSON.stringify(inputs)}`);

    try {
      let chromiumPath;

      try {
        chromiumPath = getChromiumPath();
      } catch(requireError) {
        await installChromium(utils.run, inputs.packageManager);
        chromiumPath = getChromiumPath();
      }

      if (inputs.setChromePathInEnv) {
        process.env.CHROME_PATH = chromiumPath;
      }

      console.log(`[NetlifyChromiumPlugin]: Chromium installation finished with SUCCESS (path: ${chromiumPath})`);
    } catch(error) {
      console.log('[NetlifyChromiumPlugin]: Chromium installation finished with FAILURE');

      const failFunc = inputs.failBuildOnError ? utils.build.failBuild : utils.build.failPlugin;
      failFunc('Error during Chromium installation', { error });
    }
  },
};

module.exports = NetlifyChromiumPlugin;
