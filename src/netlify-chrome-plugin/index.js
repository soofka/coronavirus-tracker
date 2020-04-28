const { installChrome } = require('./install-chrome.js');

const NetlifyChromePlugin = {
  name: 'netlify-chrome-plugin',
  onInstall: () => {
    console.log('installation starts');
    const { stdout, stderr, code } = installChrome();
    console.log('installation ends', stdout, stderr, code);
  },
};

module.exports = NetlifyChromePlugin;
