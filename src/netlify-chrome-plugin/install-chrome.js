const path = require('path');
const shell = require('shelljs');

const installChrome = () => shell.exec(path.join(__dirname, 'install-chrome.sh'));

if (!module.parent) {
  installChrome();
}

module.exports = { installChrome };
