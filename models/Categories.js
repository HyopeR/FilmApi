const {Sequelize} = require("sequelize");
const db = require('../helpers/db');

let Categories = db.define('categories', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
}, {
  timestamps: false,
  tableName: 'categories'
})

module.exports = Categories;
