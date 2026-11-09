const fs = require('fs');

const prod = fs.readFileSync('admin-products.html', 'utf8');

const uploadIdx = prod.indexOf('uploadImage');
console.log(prod.slice(uploadIdx - 100, uploadIdx + 1200));
