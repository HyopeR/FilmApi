const db = require('../helpers/db');

const { Sequelize } = require("sequelize");

const ContentsDetails = db.define('contents_details', {
    content_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    series_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        foreignKey: true
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    time: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    intro_start_time: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    intro_finish_time: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    created_at: {
        type: Sequelize.DATE,
    },
}, {
    timestamps: false,
    tableName: 'contents_details'
})

module.exports= ContentsDetails;
