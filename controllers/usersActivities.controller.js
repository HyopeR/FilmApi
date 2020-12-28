const {QueryTypes} = require("sequelize");
const lodash = require('lodash');
const UsersActivities = require('../models/UsersActivities');
const db = require('../helpers/db');

const getAllUserActivity = result => {
  UsersActivities.findAll({
    type: QueryTypes.SELECT
  })
    .then(usersActivities => result(null, usersActivities))
    .catch(err => result(err))
};

const getOneUserActivity = (user_id, activity_id, result) => {
  UsersActivities.findOne({
    type: QueryTypes.SELECT,
    where: {
      user_id: user_id,
      activity_id: activity_id
    }
  })
    .then(userActivity => {
      if (lodash.isEmpty(userActivity))
        result({notification: 'Not available ID.'});
      else
        result(null, userActivity);
    })
    .catch(err => result(err))
};

const createUserActivity = (newUserActivity, result) => {

  UsersActivities.create(newUserActivity, {
    returning: true
  })
    .then(userActivity => {
      if (lodash.isEmpty(userActivity))
        result({notification: 'Adding failed.'});
      else
        result(null, userActivity)
    })
    .catch(err => result(err));
};

module.exports = {
  getAllUserActivity,
  getOneUserActivity,
  createUserActivity
}
