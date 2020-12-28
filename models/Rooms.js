const { Sequelize } = require("sequelize");

const db = require('../helpers/db');

const Rooms = db.define('rooms', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    created_at: {
        type: Sequelize.DATE,
    },
}, {
    timestamps: false,
    tableName: 'rooms'
})

module.exports= Rooms;


