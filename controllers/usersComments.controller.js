const {QueryTypes} = require("sequelize");
const lodash = require('lodash');
const UsersComments = require('../models/UsersComments');
const db = require('../helpers/db');

const getAllUserComment = result => {
  UsersComments.findAll({
    type: QueryTypes.SELECT
  })
    .then(usersComments => result(null, usersComments))
    .catch(err => result(err))
};

const getAllContentDetailComments = (content_detail_id, limit_number, result) => {
  let query = `
    SELECT 
        users_comments.id,
        users_comments.user_id,
        users_comments.content_detail_id,
        users_comments.detail,
        users_comments.created_at,
        users_comments.updated_at,
        users.username,
        users.name,
        contents_details.content_id
    FROM users_comments
    
    LEFT JOIN users
    ON users_comments.user_id = users.id
    
    LEFT JOIN contents_details
    ON users_comments.content_detail_id = contents_details.id
    
    WHERE contents_details.id = ${content_detail_id}
    
    ORDER BY users_comments.created_at DESC
    LIMIT ${limit_number}
    `;

  db.query(query, {type: QueryTypes.SELECT})
    .then(data => {
      if (lodash.isEmpty(data))
        result({notification: 'This content has no comments yet.'})
      else
        result(null, data)
    })
    .catch(err => result(err));
};

const getOneUserComment = (user_comment_id, result) => {
  UsersComments.findOne({
    type: QueryTypes.SELECT,
    where: {
      id: user_comment_id,
    }
  })
    .then(userComment => {
      if (lodash.isEmpty(userComment))
        result({notification: 'Not available ID.'})
      else
        result(null, userComment)
    })
    .catch(err => result(err))
};

const createUserComment = (newUserComment, result) => {

  UsersComments.create(newUserComment, {
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

const updateUserComment = (user_comment_id, updateValues, result) => {

  UsersComments.update(updateValues, {
    where: {
      id: user_comment_id,
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

const deleteUserComment = (user_comment_id, result) => {

  UsersComments.destroy({
    where: {
      id: user_comment_id,
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
  getAllUserComment,
  getAllContentDetailComments,
  getOneUserComment,
  createUserComment,
  updateUserComment,
  deleteUserComment
}
