const { Sequelize } = require("sequelize");

const db = require('../helpers/db');

const ContentsCategories = db.define('contents_categories', {
    content_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    }
}, {
    timestamps: false,
    tableName: 'contents_categories'
})

ContentsCategories.removeAttribute('id');

module.exports= ContentsCategories;


