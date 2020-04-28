const shell = require('shelljs');

const installChrome = () => {
  console.log('Chrome installation started');

  const { code, stdout, stderr } = shell.exec('npm install chromium');

  console.log(`Chrome installation ended with ${code === 0 ? 'success' : 'failure'}`);
  console.log(`(output: ${stdout})`);
  console.log(`(error: ${stderr})`);

  return { code, stdout, stderr };
}

if (!module.parent) {
  installChrome();
}

module.exports = { installChrome };
