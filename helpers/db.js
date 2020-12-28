const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.LOCAL_DB_NAME, process.env.LOCAL_DB_USER, process.env.LOCAL_DB_PASSWORD, {
    dialect: 'postgres',
    host: process.env.LOCAL_DB_HOST,
    port: process.env.LOCAL_DB_PORT,
    logging: false,
});

// const db = new Sequelize(process.env.NETWORK_CONNECTION_STRING, {
//   dialect: 'postgres',
//   protocol: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   },
//   logging: false,
// });

module.exports = db;
