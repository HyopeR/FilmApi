const {QueryTypes} = require("sequelize");
const lodash = require('lodash');
const UsersScores = require('../models/UsersScores');
const db = require('../helpers/db');

const getAllUsersScore = result => {
  UsersScores.findAll({
    type: QueryTypes.SELECT
  })
    .then(usersScores => result(null, usersScores))
    .catch(err => result(err))
};

const getContentMeanScore = (content_id, result) => {
  let query = `
    SELECT 
        contents.id, 
        CAST ( COALESCE( mean_calculate.users_mean_score, 0 ) AS double precision ) as users_mean_score
    FROM contents
    LEFT JOIN 
        (  
            SELECT content_id, ROUND(AVG(score)::numeric,1) AS users_mean_score
            FROM users_scores
            GROUP BY content_id
        ) as mean_calculate
    ON contents.id = mean_calculate.content_id
    WHERE contents.id = ${content_id}
    `;

  db.query(query, {type: QueryTypes.SELECT})
    .then(data => {
      if (lodash.isEmpty(data))
        result({notification: 'Content not found.'})
      else
        result(null, lodash.head(data))
    })
    .catch(err => result(err));
};

const getOneUsersScore = (user_id, content_id, result) => {

  UsersScores.findOne({
    type: QueryTypes.SELECT,
    where: {
      user_id: user_id,
      content_id: content_id,
    },
  })
    .then(usersScores => {
      if (lodash.isEmpty(usersScores))
        result({notification: 'Not available ID.'});
      else
        result(null, usersScores)
    })
    .catch(err => result(err))
};

const createUsersScore = (newUserScore, result) => {

  UsersScores.create(newUserScore, {
    returning: true
  })
    .then(userScore => {
      if (lodash.isEmpty(userScore))
        result({notification: 'Adding failed.'});
      else
        result(null, userScore)
    })
    .catch(err => result(err));
};

const updateUsersScore = (user_id, content_id, updateValues, result) => {

  UsersScores.update(updateValues, {
    where: {
      user_id: user_id,
      content_id: content_id,
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

const deleteUsersScore = (user_id, content_id, result) => {

  UsersScores.destroy({
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
  getAllUsersScore,
  getContentMeanScore,
  getOneUsersScore,
  createUsersScore,
  updateUsersScore,
  deleteUsersScore
};
