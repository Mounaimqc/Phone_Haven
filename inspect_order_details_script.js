const fs = require('fs');

const ord = fs.readFileSync('admin-order-details.html', 'utf8');
const scriptIdx = ord.indexOf('<script type="module"');
console.log('admin-order-details script length:', ord.length - scriptIdx);
console.log(ord.slice(scriptIdx, scriptIdx + 2500));
