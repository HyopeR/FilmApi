const {QueryTypes} = require("sequelize");
const lodash = require('lodash');
const Rooms = require('../models/Rooms');
const db = require('../helpers/db');

const getAllRoom = result => {
  let query = `
    SELECT 
        rooms.id,
        rooms.name,
        rooms.active,
        rooms.created_at,
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
        
        GROUP BY 
            rooms.id, 
            rooms.name,
            rooms.active,
            rooms.created_at
        
        ORDER BY rooms.id
    `;

  db.query(query, {type: QueryTypes.SELECT})
    .then(rooms => result(null, rooms))
    .catch(err => result(err));
};

const getOneRoom = (room_id, result) => {
  let query = `
     SELECT 
        rooms.id,
        rooms.name,
        rooms.active,
        rooms.created_at,
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
    .then(room => {
      if (lodash.isEmpty(room))
        result({notification: 'Not available ID.'})
      else
        result(null, lodash.head(room))
    })
    .catch(err => result(err));
};

const createRoom = (newRoom, result) => {

  Rooms.create(newRoom, {
    returning: true
  })
    .then(room => {
      if (lodash.isEmpty(room))
        result({notification: 'Adding failed.'});
      else
        result(null, room)
    })
    .catch(err => result(err));
};

const updateRoom = (room_id, updateValues, result) => {

  Rooms.update(updateValues, {
    where: {
      id: room_id,
    },
    returning: true,
  }).then(([status, [updatedRoom]]) => {
    if (status === 1)
      result(null, updatedRoom)
    else
      result({notification: 'Update failed.'})
  })
    .catch(err => result(err))
};

const deactivateRoom = (room_id, result) => {

  Rooms.update({active: false}, {
    where: {
      id: room_id
    },
    returning: true,
  }).then(([status, [updatedRoom]]) => {
    if (status === 1) {
      result(null, updatedRoom)
    } else
      result({notification: 'Deactivated failed.'})
  })
    .catch(err => result(err))
};

const deleteRoom = (room_id, result) => {

  Rooms.destroy({
    where: {
      id: room_id
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
}

module.exports = {
  getAllRoom,
  getOneRoom,
  createRoom,
  updateRoom,
  deactivateRoom,
  deleteRoom
}
