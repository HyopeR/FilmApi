const {QueryTypes} = require("sequelize");
const lodash = require('lodash');
const Friends = require('../models/Friends');
const db = require('../helpers/db');

const getAllFriend = result => {
  Friends.findAll({
    type: QueryTypes.SELECT,
    order: [
      ['id', 'ASC']
    ]
  })
    .then(friends => result(null, friends))
    .catch(err => result(err))
};

const getAllOneUserFriends = (user_id, result) => {
  let query = `
    SELECT
        users.id,
        COALESCE( friends, ARRAY[]::json[] ) as friends,
        COALESCE( sent_wait, ARRAY[]::json[] ) as sent_wait,
        COALESCE( receive_wait, ARRAY[]::json[] ) as receive_wait
    FROM users
    
    LEFT JOIN
    (
    SELECT 
        users.id,
        detailed_friends_list.who,
        array_agg(
            json_build_object(
                    'id', detailed_friends_list.friend_id,
                    'username', detailed_friends_list.username,
                    'name', detailed_friends_list.name,
                    'surname', detailed_friends_list.surname,
                    'email', detailed_friends_list.email
            ) ORDER BY detailed_friends_list.friend_id ASC
        ) as friends
        FROM users
    
        LEFT JOIN
        (
            SELECT 
            friend_data.id,
                friend_data.friend_id,
                users.username,
                users.name,
                users.surname,
                users.email,
                friend_data.status,
                friend_data.who
    
            FROM users    
            LEFT JOIN
            (
                SELECT
                    users.id,
                CASE
                    WHEN users.id = requester_id THEN recipient_id
                    WHEN users.id = recipient_id THEN requester_id
                    END AS friend_id,
                status,
                CASE
                    WHEN (status = 1) THEN 'friend'
                    WHEN (status = 0) AND (users.id = requester_id) THEN 'requester'
                    WHEN (status = 0) AND (users.id = recipient_id) THEN 'recipient'
                    END AS who
                FROM users
    
                LEFT JOIN friends
                ON friends.requester_id = users.id OR friends.recipient_id = users.id
    
                WHERE (users.id IN (SELECT requester_id FROM friends) OR users.id IN (SELECT recipient_id FROM friends))
                AND users.active = true
            ) AS friend_data
            ON users.id = friend_data.friend_id
        ) AS detailed_friends_list
        ON detailed_friends_list.id = users.id
    
        WHERE users.active = true AND detailed_friends_list.who IS NOT null AND who = 'friend'
        GROUP BY users.id, detailed_friends_list.status, detailed_friends_list.who
        ORDER BY users.id
    ) AS friends
    ON friends.id = users.id
    
    LEFT JOIN
    (
    SELECT 
        users.id,
        detailed_friends_list.who,
        array_agg(
            json_build_object(
                    'id', detailed_friends_list.friend_id,
                    'username', detailed_friends_list.username,
                    'name', detailed_friends_list.name,
                    'surname', detailed_friends_list.surname,
                    'email', detailed_friends_list.email
            ) ORDER BY detailed_friends_list.friend_id ASC
        ) as sent_wait
        FROM users
    
        LEFT JOIN
        (
            SELECT 
            friend_data.id,
                friend_data.friend_id,
                users.username,
                users.name,
                users.surname,
                users.email,
                friend_data.status,
                friend_data.who
    
            FROM users    
            LEFT JOIN
            (
                SELECT
                    users.id,
                CASE
                    WHEN users.id = requester_id THEN recipient_id
                    WHEN users.id = recipient_id THEN requester_id
                    END AS friend_id,
                status,
                CASE
                    WHEN (status = 1) THEN 'friend'
                    WHEN (status = 0) AND (users.id = requester_id) THEN 'requester'
                    WHEN (status = 0) AND (users.id = recipient_id) THEN 'recipient'
                    END AS who
                FROM users
    
                LEFT JOIN friends
                ON friends.requester_id = users.id OR friends.recipient_id = users.id
    
                WHERE (users.id IN (SELECT requester_id FROM friends) OR users.id IN (SELECT recipient_id FROM friends))
                AND users.active = true
            ) AS friend_data
            ON users.id = friend_data.friend_id
        ) AS detailed_friends_list
        ON detailed_friends_list.id = users.id
    
        WHERE users.active = true AND detailed_friends_list.who IS NOT null AND who = 'requester'
        GROUP BY users.id, detailed_friends_list.status, detailed_friends_list.who
        ORDER BY users.id
    ) AS sent_wait
    ON sent_wait.id = users.id
    
    LEFT JOIN
    (
    SELECT 
        users.id,
        detailed_friends_list.who,
        array_agg(
            json_build_object(
                    'id', detailed_friends_list.friend_id,
                    'username', detailed_friends_list.username,
                    'name', detailed_friends_list.name,
                    'surname', detailed_friends_list.surname,
                    'email', detailed_friends_list.email
            ) ORDER BY detailed_friends_list.friend_id ASC
        ) as receive_wait
        FROM users
    
        LEFT JOIN
        (
            SELECT 
            friend_data.id,
                friend_data.friend_id,
                users.username,
                users.name,
                users.surname,
                users.email,
                friend_data.status,
                friend_data.who
    
            FROM users    
            LEFT JOIN
            (
                SELECT
                    users.id,
                CASE
                    WHEN users.id = requester_id THEN recipient_id
                    WHEN users.id = recipient_id THEN requester_id
                    END AS friend_id,
                status,
                CASE
                    WHEN (status = 1) THEN 'friend'
                    WHEN (status = 0) AND (users.id = requester_id) THEN 'requester'
                    WHEN (status = 0) AND (users.id = recipient_id) THEN 'recipient'
                    END AS who
                FROM users
        
                LEFT JOIN friends
                ON friends.requester_id = users.id OR friends.recipient_id = users.id
    
                WHERE (users.id IN (SELECT requester_id FROM friends) OR users.id IN (SELECT recipient_id FROM friends))
                AND users.active = true
            ) AS friend_data
            ON users.id = friend_data.friend_id
        ) AS detailed_friends_list
        ON detailed_friends_list.id = users.id
    
        WHERE users.active = true AND detailed_friends_list.who IS NOT null AND who = 'recipient'
        GROUP BY users.id, detailed_friends_list.status, detailed_friends_list.who
        ORDER BY users.id
    ) AS receive_wait
    ON receive_wait.id = users.id
    
    WHERE users.id = ${user_id}
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

const getOneFriend = (friend_record_id, result) => {
  Friends.findOne({
    type: QueryTypes.SELECT,
    where: {
      id: friend_record_id
    }
  })
    .then(friend => {
      if (lodash.isEmpty(friend))
        result({notification: 'Not available ID.'})
      else
        result(null, friend)
    })
    .catch(err => result(err))
};

const createFriend = (newFriend, result) => {

  Friends.create(newFriend, {
    returning: true
  })
    .then(friend => {
      if (lodash.isEmpty(friend))
        result({notification: 'Adding failed.'});
      else
        result(null, friend)
    })
    .catch(err => result(err));
};

const updateFriend = (friend_record_id, updateValues, result) => {

  Friends.update(updateValues, {
    where: {
      id: friend_record_id
    },
    returning: true,
  }).then(([status, [updatedFriend]]) => {
    if (status === 1)
      result(null, updatedFriend)
    else
      result({notification: 'Update failed.'})
  })
    .catch(err => result(err))
};

const deleteFriend = (friend_record_id, result) => {

  Friends.destroy({
    where: {
      id: friend_record_id
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
  getAllFriend,
  getAllOneUserFriends,
  getOneFriend,
  createFriend,
  updateFriend,
  deleteFriend
}
