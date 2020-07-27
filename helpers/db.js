const {Pool, Client} = require('pg');
const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});



module.exports = client;
