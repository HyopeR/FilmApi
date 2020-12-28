const { Sequelize } = require("sequelize");

const db = require('../helpers/db');

const RoomsActivities = db.define('rooms_activities', {
    room_id: {
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
    tableName: 'rooms_activities'
})

RoomsActivities.removeAttribute('id');

module.exports = RoomsActivities;
