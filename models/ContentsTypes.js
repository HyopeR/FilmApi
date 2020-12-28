const {Sequelize} = require("sequelize");
const db = require('../helpers/db');

let ContentsTypes = db.define('contents_types', {
    type_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'contents_types'
})

module.exports= ContentsTypes;
