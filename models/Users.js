const { Sequelize} = require("sequelize");

const db = require('../helpers/db');

const Users = db.define('users', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    created_at: {
        type: Sequelize.DATE,
    },
}, {
    timestamps: false,
    tableName: 'users'
})

module.exports = Users;
