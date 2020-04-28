// require('child_process').execSync(
//   'npm install chromium chrome-launcher',
//   {
//     cwd: process.cwd(),
//     stdio: 'inherit',
//   },
// );

console.log('Testing started');

const chromium = require('chromium');
process.env.CHROME_PATH = chromium.path;

const { Launcher, launch, killAll } = require('chrome-launcher');
console.log('Installations:', Launcher.getInstallations());

return launch({
  startingUrl: 'https://google.com'
})
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
