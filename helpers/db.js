const { Sequelize } = require('sequelize');

const client = new Sequelize(process.env.LOCAL_DB_NAME, process.env.LOCAL_DB_USER, process.env.LOCAL_DB_PASSWORD, {
    dialect: 'postgres',
    host: process.env.LOCAL_DB_HOST,
    port: process.env.LOCAL_DB_PORT,
    logging: false,
});

module.exports = client;
