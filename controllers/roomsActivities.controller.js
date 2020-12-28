const {QueryTypes} = require("sequelize");
const lodash = require('lodash');
const RoomsActivities = require('../models/RoomsActivities');
const db = require('../helpers/db');

const getAllRoomActivity = result => {
  RoomsActivities.findAll({
    type: QueryTypes.SELECT
  })
    .then(roomsActivities => result(null, roomsActivities))
    .catch(err => result(err))
};

const getOneRoomActivity = (room_id, activity_id, result) => {
  RoomsActivities.findOne({
    type: QueryTypes.SELECT,
    where: {
      room_id: room_id,
      activity_id: activity_id
    }
  })
    .then(roomActivity => {
      if (lodash.isEmpty(roomActivity))
        result({notification: 'Not available ID.'});
      else
        result(null, roomActivity);
    })
    .catch(err => result(err))
};

const createRoomActivity = (newRoomActivity, result) => {

  RoomsActivities.create(newRoomActivity, {
    returning: true
  })
    .then(roomActivity => {
      if (lodash.isEmpty(roomActivity))
        result({notification: 'Adding failed.'});
      else
        result(null, roomActivity)
    })
    .catch(err => result(err));
};

module.exports = {
  getAllRoomActivity,
  getOneRoomActivity,
  createRoomActivity
}
