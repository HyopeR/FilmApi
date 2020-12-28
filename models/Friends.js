const { Sequelize } = require("sequelize");

const db = require('../helpers/db');

const Friends = db.define('friends', {
    requester_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    recipient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    created_at: {
        type: Sequelize.DATE,
    },
    updated_at: {
        type: Sequelize.DATE,
    },
}, {
    timestamps: false,
    tableName: 'friends'
})

module.exports= Friends;
