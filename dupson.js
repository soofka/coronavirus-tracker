console.log('running lighthouse with chrome path =', process.env.CHROME_PATH);
require('child_process').execSync('npm run test:lhci',
{
  cwd: process.cwd(),
  stdio: "inherit"
});
