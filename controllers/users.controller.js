const { QueryTypes } = require("sequelize");
const lodash = require('lodash');
const bcrypt = require('bcryptjs');

const Users = require('../models/Users');
const db = require('../helpers/db');
const {controlEmail} = require('../helpers/regexControls');

const getQueryRoofDynamic = (parameterString) => {

  return `SELECT 
        users.id,
        users.username,
        users.email,
        users.name,
        users.surname,
        users.password,
        users.active,
        users.created_at,
        COALESCE( lists, ARRAY[]::json[] ) as lists,
        COALESCE( friends, ARRAY[]::json[] ) as friends,
        COALESCE( sent_wait, ARRAY[]::json[] ) as sent_wait,
        COALESCE( receive_wait, ARRAY[]::json[] ) as receive_wait,
        COALESCE( rooms, ARRAY[]::json[] ) as rooms
    FROM users
    LEFT JOIN 
    (
        SELECT 
            users_lists.user_id,
            array_agg( 
            json_build_object(
            'id', contents.id,
            'type_id', contents.type_id,
            'type_name', contents_types.type_name,
            'tr_name', contents.tr_name,
            'eng_name', contents.eng_name,
            'poster_url', contents.poster_url,
            'imdb_score', contents.imdb_score,
            'active', contents.active,
            'created_at', contents.created_at
        ) ORDER BY contents.id ASC) as lists
        FROM users_lists
        
        LEFT JOIN contents
        ON users_lists.content_id = contents.id
        
        LEFT JOIN contents_types
        ON contents.type_id = contents_types.id
        
        GROUP BY users_lists.user_id
        ORDER BY users_lists.user_id
    ) AS lists
    
    ON users.id = lists.user_id
    
    LEFT JOIN
    (
        
        SELECT
        users.id,
        friends,
        sent_wait,
        receive_wait
FROM users

    LEFT JOIN
(
SELECT 
    users.id,
    detailed_friends_list.who,
    array_agg(
        json_build_object(
                'friend_record_id', detailed_friends_list.friend_record_id,
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
        friend_data.friend_record_id,
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
                friends.id AS friend_record_id,
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
                'friend_record_id', detailed_friends_list.friend_record_id,
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
        friend_data.friend_record_id,
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
                friends.id AS friend_record_id,
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
                'friend_record_id', detailed_friends_list.friend_record_id,
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
        friend_data.friend_record_id,
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
                friends.id AS friend_record_id,
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

    ) AS friends
    ON users.id = friends.id
    
    LEFT JOIN
    (
    SELECT
        users.id,
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
        
        GROUP BY users.id
        ORDER BY users.id
    ) AS rooms
    ON users.id = rooms.id
    `
    +
    parameterString
    +
    `
    ORDER BY users.id
    `;
};

const getAllUser = (result) => {
  let query = getQueryRoofDynamic(``);

  db.query(query, { type: QueryTypes.SELECT })
    .then(users => result(null, users))
    .catch(err => result(err));
};

const getAllActiveUser = result => {
  let query = getQueryRoofDynamic(`WHERE users.active = true`);

  db.query(query, { type: QueryTypes.SELECT })
    .then(users => result(null, users))
    .catch(err => result(err));
};

const getOneUser = (user_id, result) => {
  let query = getQueryRoofDynamic(`WHERE users.id = ${user_id}`);

  db.query(query, { type: QueryTypes.SELECT })
    .then((users) => {
      if(lodash.isEmpty(users)) {
        result({ notification: 'Not available ID.' });
      } else {
        result(null, lodash.head(users))
      }
    })
    .catch(err => result(err));
};

const updateUser = async (user_id, updateValues, result) => {

  let keys = lodash.keys(updateValues);
  if(keys.includes('password'))
    updateValues.password = await bcrypt.hash(updateValues.password, 10);
  if(keys.includes('email')) {
    if(!controlEmail(updateValues.email))
      result({notification: 'Email is invalid.'})
  }

  Users.update(updateValues, {
    where: {
      id: user_id
    },
    returning: true,
  }).then(([status, [updatedUser]]) => {
    if(status === 1) {
      result(null, updatedUser)
    } else
      result({notification: 'Update failed.'})
  })
    .catch(err => result(err))
};

const deactivateUser = (user_id, result) => {

  Users.update({active: false}, {
    where: {
      id: user_id
    },
    returning: true,
  }).then(([status, [updatedUser]]) => {
    if(status === 1) {
      result(null, updatedUser)
    } else
      result({notification: 'Deactivated failed.'})
  })
    .catch(err => result(err))
};

const deleteUser = (user_id, result) => {
  Users.destroy({
    where: {
      id: user_id
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

module.exports = { getAllUser, getAllActiveUser, getOneUser, updateUser, deactivateUser, deleteUser };
