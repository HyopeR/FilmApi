const {Sequelize} = require("sequelize");
const db = require('../helpers/db');

const Activities = db.define('activities', {
  content_detail_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    foreignKey: true
  },
  is_one: {
    type: Sequelize.STRING,
    defaultValue: true
  },
  activity_start: {
    type: Sequelize.STRING,
    defaultValue: true,
  },
  activity_finish: {
    type: Sequelize.STRING,
    defaultValue: false
  },
  activity_score: {
    type: Sequelize.STRING,
    defaultValue: false
  },
  activity_comment: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  activity_passing_time: {
    type: Sequelize.BOOLEAN,
    defaultValue: '0'
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  created_at: {
    type: Sequelize.DATE,
  },
  updated_at: {
    type: Sequelize.DATE,
  }
}, {
  timestamps: false,
  tableName: 'activities'
})

module.exports = Activities;

