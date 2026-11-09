const fs = require('fs');

const prod = fs.readFileSync('admin-products.html', 'utf8');
const scriptIdx = prod.indexOf('editingIdInput');
console.log(prod.slice(scriptIdx, scriptIdx + 2500));
