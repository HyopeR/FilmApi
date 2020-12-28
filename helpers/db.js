const { Sequelize } = require('sequelize');

// const db = new Sequelize(process.env.LOCAL_DB_NAME, process.env.LOCAL_DB_USER, process.env.LOCAL_DB_PASSWORD, {
//     dialect: 'postgres',
//     host: process.env.LOCAL_DB_HOST,
//     port: process.env.LOCAL_DB_PORT,
//     logging: false,
// });

const db = new Sequelize('postgres://bxshxcrnvobulg:1df8910952e1a96e4fd85256865fb2ee40f1c4ed8e4c9b283aaf2f4e1a473dc2@ec2-52-204-232-46.compute-1.amazonaws.com:5432/defa3n14i9ph68', {
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  },
});

module.exports = db;
