const {QueryTypes} = require("sequelize");
const lodash = require('lodash');
const UsersLists = require('../models/UsersLists');
const db = require('../helpers/db');

const getAllUserList = result => {
  let query = `SELECT
        users.id,
        users.username,
        users.name,
        users.surname,
        array_agg( 
            json_build_object(
            'id', contents.id,
            'type_id', contents.type_id,
            'type_name', contents_types.type_name,
            'tr_name', contents.tr_name,
            'eng_name', contents.eng_name,
            'imdb_score', contents.imdb_score,
            'active', contents.active,
            'created_at', contents.created_at
        )) as lists
    FROM users 
    
    LEFT JOIN users_lists
    ON users.id = users_lists.user_id
    
    LEFT JOIN contents
    ON users_lists.content_id = contents.id
    
    LEFT JOIN contents_types
    ON contents.type_id = contents_types.id
    
    WHERE users.id IN (SELECT user_id FROM users_lists)
    
    GROUP BY
        users.id,
        users.username,
        users.name,
        users.surname
    
    ORDER BY users.id   
    `;

  db.query(query, {type: QueryTypes.SELECT})
    .then(usersLists => result(null, usersLists))
    .catch(err => result(err));
};

const getOneUserList = (user_id, result) => {
  let query = `SELECT
        users.id,
        users.username,
        users.name,
        users.surname,
        array_agg( 
            json_build_object(
            'id', contents.id,
            'type_id', contents.type_id,
            'type_name', contents_types.type_name,
            'tr_name', contents.tr_name,
            'eng_name', contents.eng_name,
            'imdb_score', contents.imdb_score,
            'active', contents.active,
            'created_at', contents.created_at
        )) as lists
    FROM users 
    
    LEFT JOIN users_lists
    ON users.id = users_lists.user_id
    
    LEFT JOIN contents
    ON users_lists.content_id = contents.id
    
    LEFT JOIN contents_types
    ON contents.type_id = contents_types.id
    
    WHERE users.id IN (SELECT user_id FROM users_lists) AND
    users.id = ${user_id}
    
    GROUP BY
        users.id,
        users.username,
        users.name,
        users.surname
    
    ORDER BY users.id`;

  db.query(query, {type: QueryTypes.SELECT})
    .then(userLists => {
      if (lodash.isEmpty(userLists)) {
        result({notification: 'Not available ID.'});
      } else {
        result(null, lodash.head(userLists))
      }
    })
    .catch(err => result(err));
};

const addListItem = (newUserListItem, result) => {

  UsersLists.create(newUserListItem, {
    returning: true
  })
    .then(listItem => {
      if (lodash.isEmpty(listItem))
        result({notification: 'Adding failed.'});
      else
        result(null, listItem)
    })
    .catch(err => result(err));
};

const deleteListItem = (user_id, content_id, result) => {

  UsersLists.destroy({
    where: {
      user_id: user_id,
      content_id: content_id,
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
  getAllUserList,
  getOneUserList,
  addListItem,
  deleteListItem
}
