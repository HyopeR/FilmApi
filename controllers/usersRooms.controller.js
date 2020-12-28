const {QueryTypes} = require("sequelize");
const lodash = require('lodash');
const UsersRooms = require('../models/UsersRooms');
const db = require('../helpers/db');

const getAllUserRoom = result => {
  UsersRooms.findAll({
    type: QueryTypes.SELECT
  })
    .then(usersRooms => result(null, usersRooms))
    .catch(err => result(err))
};

const getOneRoomUserList = (room_id, result) => {
  let query = `
    SELECT 
        rooms.id,
        rooms.name,
        array_agg( json_build_object(
                            'id', users.id,
                            'username', users.username,
                            'name', users.name,
                            'surname', users.surname,
                            'authority', users_rooms.authority,
                            'joined_at', users_rooms.created_at
        ) ORDER BY users.id ASC ) as user_list
        
        FROM rooms
        
        LEFT JOIN users_rooms
        ON rooms.id = users_rooms.room_id
        
        LEFT JOIN users
        ON users_rooms.user_id = users.id
        
        WHERE rooms.id = ${room_id}
        
        GROUP BY 
            rooms.id, 
            rooms.name,
            rooms.active,
            rooms.created_at
        
        ORDER BY rooms.id
    `;

  db.query(query, {type: QueryTypes.SELECT})
    .then(data => {
      if (lodash.isEmpty(data))
        result({notification: 'Not available ID.'})
      else
        result(null, lodash.head(data))
    })
    .catch(err => result(err));
};

const getOneUserRoomList = (user_id, result) => {
  let query = `
    SELECT
        users.id,
        users.username,
        array_agg(
            json_build_object(
                'id', rooms.id,
                'name', rooms.name,
                'authority', users_rooms.authority,
                'joined_at', users_rooms.created_at
            ) ORDER BY rooms.id ASC 
        ) as rooms
        
        FROM users
        
        LEFT JOIN users_rooms
        ON users.id = users_rooms.user_id
        
        LEFT JOIN rooms
        ON users_rooms.room_id = rooms.id
        
        WHERE users.id IN (SELECT user_id FROM users_rooms)
        AND users.id = ${user_id}
        
        GROUP BY users.id
        ORDER BY users.id
    `;

  db.query(query, {type: QueryTypes.SELECT})
    .then(data => {
      if (lodash.isEmpty(data))
        result({notification: 'Not available ID.'})
      else
        result(null, lodash.head(data))
    })
    .catch(err => result(err));
};

const getOneUserRoom = (user_id, room_id, result) => {
  let query = `SELECT * FROM users_rooms WHERE user_id = ${user_id} AND room_id = ${room_id}`;

  UsersRooms.findOne({
    type: QueryTypes.SELECT,
    where: {
      user_id: user_id,
      room_id: room_id
    }
  })
    .then(userRoom => {
      if (lodash.isEmpty(userRoom))
        result({notification: 'Not available ID.'})
      else
        result(null, userRoom)
    })
    .catch(err => result(err))
};

const createUserRoom = (newUserRoom, result) => {

  UsersRooms.create(newUserRoom, {
    returning: true
  })
    .then(userRoom => {
      if (lodash.isEmpty(userRoom))
        result({notification: 'Adding failed.'});
      else
        result(null, userRoom)
    })
    .catch(err => result(err));
};

const updateUserRoom = (user_id, room_id, updateValues, result) => {

  UsersRooms.update(updateValues, {
    where: {
      user_id: user_id,
      room_id: room_id,
    },
    returning: true,
  }).then(([status, [updatedUserScore]]) => {
    if (status === 1)
      result(null, updatedUserScore)
    else
      result({notification: 'Update failed.'})
  })
    .catch(err => result(err))
};

const deleteUserRoom = (user_id, room_id, result) => {

  UsersRooms.destroy({
    where: {
      user_id: user_id,
      room_id: room_id,
    },
    returning: true,
  })
    .then(data => {
      if (data === 1)
        result(null, {success: true})
      else
        result({notification: 'Delete failed.'})
    })
    .catch(err => result(err))
};

module.exports = {
  getAllUserRoom,
  getOneRoomUserList,
  getOneUserRoomList,
  getOneUserRoom,
  createUserRoom,
  updateUserRoom,
  deleteUserRoom
}
