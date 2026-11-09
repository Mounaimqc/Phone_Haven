const fs = require('fs');

const ord = fs.readFileSync('admin-order-details.html', 'utf8');

// Find status selector or status buttons
const statusIdx = ord.indexOf('status');
console.log('Status occurrences:');
const matches = ord.match(/<select[\s\S]*?<\/select>/gi);
if (matches) {
    matches.forEach(m => console.log('Select:', m));
}

// Find main headings
const headings = ord.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi);
if (headings) {
    headings.forEach(h => console.log('Heading:', h.replace(/<[^>]+>/g, '').trim()));
}
