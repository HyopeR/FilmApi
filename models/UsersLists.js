const { Sequelize } = require("sequelize");

const db = require('../helpers/db');

const UsersLists = db.define('users_lists', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    content_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    created_at: {
        type: Sequelize.DATE,
    },
}, {
    timestamps: false,
    tableName: 'users_lists'
})

UsersLists.removeAttribute('id');
module.exports = UsersLists;
