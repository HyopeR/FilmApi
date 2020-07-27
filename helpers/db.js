const {Pool, Client} = require('pg');
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    sslmode: process.env.SSL_MODE
});

// const client = new Client({
//     connectionString: process.env.CONNECTION_STRING,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

module.exports = client;
