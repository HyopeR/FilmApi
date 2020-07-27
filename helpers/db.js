const {Pool, Client} = require('pg');
// const client = new Client({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

const client = new Client({
    connectionString: 'postgres://bxshxcrnvobulg:1df8910952e1a96e4fd85256865fb2ee40f1c4ed8e4c9b283aaf2f4e1a473dc2@ec2-52-204-232-46.compute-1.amazonaws.com:5432/defa3n14i9ph68',
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = client;
