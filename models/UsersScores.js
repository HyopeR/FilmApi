const { Sequelize } = require("sequelize");

const db = require('../helpers/db');

const UsersScores = db.define('users_scores', {
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
    score: {
        type: Sequelize.FLOAT,
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
    tableName: 'users_scores'
})

UsersScores.removeAttribute('id');
module.exports = UsersScores;



