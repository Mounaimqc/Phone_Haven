const fs = require('fs');

const prod = fs.readFileSync('admin-products.html', 'utf8');
const idx = 71493;
console.log(prod.slice(idx - 600, idx + 1000));
