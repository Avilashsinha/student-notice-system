console.log('Starting database test...');

const { Pool } = require('pg');
require('dotenv').config();

console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error:', err.message);
        console.error('Full error:', err);
    } else {
        console.log('Success! Current time:', res.rows[0].now);
    }
    pool.end();
});
