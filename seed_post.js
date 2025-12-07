const fs = require('fs');

(async () => {
    try {
        const body = fs.readFileSync('mock_user.json', 'utf8');
        const res = await fetch(process.DB_URI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
        });
        const text = await res.text();
        console.log(text);
    } catch (err) {
        console.error('Request failed:', err.message || err);
    }
})();
