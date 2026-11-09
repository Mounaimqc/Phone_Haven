const fs = require('fs');

const prod = fs.readFileSync('admin-products.html', 'utf8');

const imgIdx = prod.indexOf('gallery');
console.log('Image / gallery snippet:');
if (imgIdx !== -1) {
    console.log(prod.slice(imgIdx - 100, imgIdx + 1200));
} else {
    console.log('Looking for file-input or images:');
    const idx2 = prod.indexOf('product-image');
    console.log(prod.slice(idx2 - 100, idx2 + 1200));
}
