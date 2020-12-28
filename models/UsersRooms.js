const { Sequelize } = require("sequelize");

const db = require('../helpers/db');

const UsersRooms = db.define('users_rooms', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    authority: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    created_at: {
        type: Sequelize.DATE,
    },
}, {
    timestamps: false,
    tableName: 'users_rooms'
})

UsersRooms.removeAttribute('id');

module.exports = UsersRooms;


