const { installChrome } = require('./install-chrome.js');

const NetlifyChromePlugin = {
  name: 'netlify-chrome-plugin',
  onInstall: () => {
    installChrome();
    // process.env.CHROME_PATH = '/opt/build/repo/node_modules/chromium/lib/chromium/chrome-win/chrome.exe';
  },
};

module.exports = NetlifyChromePlugin;
