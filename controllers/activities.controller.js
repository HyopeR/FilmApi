const {QueryTypes} = require("sequelize");
const lodash = require('lodash');

const Activities = require('../models/Activities');
const db = require('../helpers/db');

const getAllActivity = result => {

  Activities.findAll({type: QueryTypes.SELECT})
    .then(activities => result(null, activities))
    .catch(err => result(err));
};

const getAllActiveActivity = result => {

  Activities.findAll({
    where: {
      active: true
    },
    type: QueryTypes.SELECT
  })
    .then(activities => result(null, activities))
    .catch(err => result(err));
};

const getOneActivity = (user_id, content_detail_id, result) => {
  let query = `
    SELECT
        users_activities.activity_id as id,
        users_activities.user_id,
        activities.content_detail_id,
        activities.is_one,
        activities.activity_start,
        activities.activity_finish,
        activities.activity_score,
        activities.activity_comment,
        activities.activity_passing_time,
        activities.created_at,
        activities.updated_at
    
    FROM users_activities
    
    LEFT JOIN activities
    ON users_activities.activity_id = activities.id
    
    LEFT JOIN users
    ON users_activities.user_id = users.id
    
    LEFT JOIN contents_details
    ON activities.content_detail_id = contents_details.id
    
    WHERE user_id = ${user_id} AND content_detail_id = ${content_detail_id}
    `;

  db.query(query, {type: QueryTypes.SELECT})
    .then(activities => {
      if (lodash.isEmpty(activities))
        result({notification: 'No activity yet.'})
      else
        result(null, lodash.head(activities))
    })
    .catch(err => result(err));
};

const createActivity = (newActivity, result) => {

  Activities.create(newActivity, {
    returning: true
  })

    .then(activity => {
      if (lodash.isEmpty(activity))
        result({notification: 'Not available ID.'});
      else
        result(null, activity)
    })
    .catch(err => result(err));
};

const updateActivity = (activity_id, updateValues, result) => {

  Activities.update(updateValues, {
    where: {
      id: activity_id
    },
    returning: true,
  }).then(([status, [updatedActivity]]) => {
    if (status === 1)
      result(null, updatedActivity)
    else
      result({notification: 'Update failed.'})
  })
    .catch(err => result(err))
};

const deactivateActivity = (activity_id, result) => {

  Activities.update({active: false}, {
    where: {
      id: activity_id
    },
    returning: true,
  }).then(([status, [updatedActivity]]) => {
    if(status === 1) {
      result(null, updatedActivity)
    } else
      result({notification: 'Deactivated failed.'})
  })
    .catch(err => result(err))
};

const deleteActivity  = (activity_id, result) => {
  Activities.destroy({
    where: {
      id: activity_id
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

const getAllFilterScores = (user_id, limit_number, result) => {
  let query = `
        SELECT
            users_scores.user_id,
            users_scores.content_id,
            users_scores.score,
            users_scores.created_at,
            users_scores.updated_at,
            users.username,
            users.name,
            contents.tr_name,
            contents.eng_name
        FROM users_scores
    
        LEFT JOIN contents
        ON users_scores.content_id = contents.id
    
        LEFT JOIN users
        ON users_scores.user_id = users.id
    
        WHERE
        (
            users.id IN
        (
            SELECT
        CASE
        WHEN users.id = friend_selector.requester_id THEN friend_selector.recipient_id
        WHEN users.id = friend_selector.recipient_id THEN friend_selector.requester_id
    
        END AS friend_id FROM users
    
        LEFT JOIN (
    
            SELECT
        friends.id,
            friends.requester_id,
            friends.recipient_id,
            friends.status,
            friends.created_at,
            friends.updated_at,
            requester.requester_user,
            recipient.recipient_user
        FROM friends
    
        LEFT JOIN
        (
            SELECT
        friends.id,
        json_build_object(
            'id', users_puppet.id,
            'username', users_puppet.username,
            'name', users_puppet.name,
            'surname', users_puppet.surname,
            'email', users_puppet.email
        ) as requester_user
    
        FROM friends
        LEFT JOIN (SELECT * FROM users WHERE users.active = true) as users_puppet
        ON users_puppet.id = requester_id
        ORDER BY friends.id
    ) AS requester
        ON friends.id = requester.id
    
        LEFT JOIN
        (
            SELECT
        friends.id,
        json_build_object(
            'id', users_puppet.id,
            'username', users_puppet.username,
            'name', users_puppet.name,
            'surname', users_puppet.surname,
            'email', users_puppet.email
        ) as recipient_user
    
        FROM friends
        LEFT JOIN (SELECT * FROM users WHERE users.active = true) as users_puppet
        ON users_puppet.id = recipient_id
        ORDER BY friends.id
    ) AS recipient
        ON friends.id = recipient.id
    
        WHERE friends.status = 1
    
    ) AS friend_selector
        ON friend_selector.requester_id = users.id OR friend_selector.recipient_id = users.id
        WHERE
        (
            users.id IN (SELECT requester_id FROM friends)
        OR users.id IN (SELECT recipient_id FROM friends)
    )
        AND users.id = ${user_id}
    )
    )
    
        ORDER BY users_scores.created_at DESC
        LIMIT ${limit_number}
    `;

  db.query(query, {type: QueryTypes.SELECT})
    .then(data => {
      if (lodash.isEmpty(data))
        result({notification: 'No friends score action yet.'})
      else
        result(null, data)
    })
    .catch(err => result(err));
};

const getAllFilterComments = (user_id, limit_number, result) => {
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
        contents_details.content_id,
        contents.tr_name,
        contents.eng_name,
        series.tr_episode_name,
        series.eng_episode_name,
        series.episode_number,
        series.series_season
        
    FROM users_comments
    
    LEFT JOIN users
    ON users_comments.user_id = users.id
    
    LEFT JOIN contents_details
    ON users_comments.content_detail_id = contents_details.id
    
    LEFT JOIN contents
    ON contents_details.content_id = contents.id
    
    LEFT JOIN series
    ON contents_details.series_id = series.id
    
    WHERE 
    (
        users.id IN 
        (
            SELECT 
                    CASE
                        WHEN users.id = friend_selector.requester_id THEN friend_selector.recipient_id
                        WHEN users.id = friend_selector.recipient_id THEN friend_selector.requester_id
    
                    END AS friend_İD FROM users
    
                    LEFT JOIN (
    
                    SELECT 
                        friends.id,
                        friends.requester_id,
                        friends.recipient_id,
                        friends.status,
                        friends.created_at,
                        friends.updated_at,
                        requester.requester_user,
                        recipient.recipient_user
                    FROM friends
    
                    LEFT JOIN
                    (
                        SELECT 
                            friends.id,
                            json_build_object(
                                'id', users_puppet.id,
                                'username', users_puppet.username,
                                'name', users_puppet.name,
                                'surname', users_puppet.surname,
                                'email', users_puppet.email
                            ) as requester_user
    
                        FROM friends
                        LEFT JOIN (SELECT * FROM users WHERE users.active = true) as users_puppet
                        ON users_puppet.id = requester_id
                        ORDER BY friends.id
                    ) AS requester
                    ON friends.id = requester.id
    
                LEFT JOIN
                (
                    SELECT 
                        friends.id,
                        json_build_object(
                            'id', users_puppet.id,
                            'username', users_puppet.username,
                            'name', users_puppet.name,
                            'surname', users_puppet.surname,
                            'email', users_puppet.email
                        ) as recipient_user
        
                        FROM friends
                        LEFT JOIN (SELECT * FROM users WHERE users.active = true) as users_puppet
                        ON users_puppet.id = recipient_id
                        ORDER BY friends.id
                    ) AS recipient
                    ON friends.id = recipient.id
                    
                    WHERE friends.status = 1
    
                ) AS friend_selector
                ON friend_selector.requester_id = users.id OR friend_selector.recipient_id = users.id
                WHERE 
                    ( 
                        users.id IN (SELECT requester_id FROM friends)
                        OR users.id IN (SELECT recipient_id FROM friends) 
                    )
                AND users.id = ${user_id}
        )
    )
    
    ORDER BY users_comments.created_at DESC
    LIMIT ${limit_number}
    `;

  db.query(query, {type: QueryTypes.SELECT})
    .then(data => {
      if (lodash.isEmpty(data))
        result({notification: 'No friends comment action yet.'})
      else
        result(null, data)
    })
    .catch(err => result(err));

};

module.exports = {
  getAllActivity,
  getAllActiveActivity,
  getOneActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  deactivateActivity,
  getAllFilterScores,
  getAllFilterComments
}
