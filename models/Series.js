const { Sequelize } = require("sequelize");

const db = require('../helpers/db');

const Series = db.define('series', {
    content_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    series_season: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    tr_episode_name: {
        type: Sequelize.STRING,
    },
    eng_episode_name: {
        type: Sequelize.STRING,
    },
    episode_number: {
        type: Sequelize.INTEGER,
    },
}, {
    timestamps: false,
    tableName: 'series'
})

module.exports= Series;
