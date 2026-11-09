const fs = require('fs');

['admin-orders.html', 'admin-products.html', 'admin-shipping.html'].forEach(f => {
    const html = fs.readFileSync(f, 'utf8');
    const header = html.match(/<header[\s\S]*?<\/header>/i);
    console.log(`=== ${f} Header ===`);
    if (header) console.log(header[0].slice(0, 300));
});
