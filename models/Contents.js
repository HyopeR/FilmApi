const db = require('../helpers/db');

const { Sequelize } = require("sequelize");

const Contents = db.define('contents', {
    type_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        foreignKey: true
    },
    tr_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    eng_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    imdb_score: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    poster_url: {
        type: Sequelize.STRING,
        defaultValue: 'https://img.webme.com/pic/r/roomovie/empty_poster.jpg',
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
    tableName: 'contents'
})

module.exports = Contents;
