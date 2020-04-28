const { installChrome } = require('./install-chrome.js');

const NetlifyChromePlugin = {
  name: 'netlify-chrome-plugin',
  onInstall: () => {
    installChrome();
  },
};

module.exports = NetlifyChromePlugin;
