const fs = require('fs');

const ord = fs.readFileSync('admin-order-details.html', 'utf8');
const mainIdx = ord.indexOf('<main');
console.log(ord.slice(mainIdx + 2500, mainIdx + 6000));
