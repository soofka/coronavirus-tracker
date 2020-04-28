const fs = require('fs');

console.log('WUT', process.env.CHROME_PATH);
console.log('egzystuje', fs.existsSync(process.env.CHROME_PATH));