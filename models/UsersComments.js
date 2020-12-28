const { Sequelize } = require("sequelize");

const db = require('../helpers/db');

const UsersComments = db.define('users_comments', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    content_detail_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    detail: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    created_at: {
        type: Sequelize.DATE,
    },
    updated_at: {
        type: Sequelize.DATE,
    },
}, {
    timestamps: false,
    tableName: 'users_comments'
})

module.exports= UsersComments;




