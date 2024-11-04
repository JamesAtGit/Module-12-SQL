require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

client.connect()
    .then(async () => {
        console.log('Connected to the database');
        // Set the search path here
        await client.query(`SET search_path TO employee_tracker, public;`);
    })
    .catch(err => console.error('Connection error', err.stack));module.exports = client;


module.exports = client;
