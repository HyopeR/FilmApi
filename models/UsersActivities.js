const { Sequelize } = require("sequelize");

const db = require('../helpers/db');

const UsersActivities = db.define('users_activities', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    activity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    }
}, {
    timestamps: false,
    tableName: 'users_activities'
})

UsersActivities.removeAttribute('id');

module.exports = UsersActivities;


