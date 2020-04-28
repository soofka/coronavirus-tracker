const path = require('path');
const shell = require('shelljs');
// const fetch = require('node-fetch');

// fetch('https://raw.githubusercontent.com/GoogleChrome/chrome-launcher/v0.8.0/scripts/download-chrome.sh')
//   .then(response => response.text())
//   .then(script => )

shell.exec(path.resolve('./dupa.sh'));
