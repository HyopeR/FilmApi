const db = require('../helpers/db');

let Activities = function(
    content_detail_id,
    is_one = true,
    activity_start = true,
    activity_finish = false,
    activity_score = false,
    activity_comment  = false,
    activity_passing_time  = '0',
    active = true){
    this.content_detail_id = content_detail_id;
    this.is_one = is_one;
    this.activity_start = activity_start;
    this.activity_finish = activity_finish;
    this.activity_score = activity_score;
    this.activity_comment = activity_comment;
    this.activity_passing_time = activity_passing_time;
    this.active = active;
};

Activities.getAll = result => {
    let query = `SELECT * FROM activities`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Activities.getAllActive = result => {
    let query = `SELECT * FROM activities WHERE active = true`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Activities.getOne = (user_id, content_detail_id, result) => {
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
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'No activity yet.' });
    });
};

Activities.create = (newActivity, result) => {
    let query = `INSERT INTO 
    activities (content_detail_id, is_one, activity_start, activity_finish, activity_score, activity_comment, activity_passing_time, active) 
    VALUES( $1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING *`;

    const { content_detail_id, is_one, activity_start, activity_finish, activity_score, activity_comment, activity_passing_time, active } = newActivity;

    db.query(query, [content_detail_id, is_one, activity_start, activity_finish, activity_score, activity_comment, activity_passing_time, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

Activities.update = (activity_id, updateActivity, result) => {
    let query = `UPDATE activities 
    SET is_one = $1,
        activity_start = $2,
        activity_finish = $3,
        activity_score = $4,
        activity_comment = $5,
        activity_passing_time = $6,
        updated_at = $7
    WHERE id = ${activity_id} RETURNING *`;

    const { is_one, activity_start, activity_finish, activity_score, activity_comment, activity_passing_time, updated_at } = updateActivity;

    db.query(query, [is_one, activity_start, activity_finish, activity_score, activity_comment, activity_passing_time, updated_at], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });
    });
};

Activities.deactivate = (activity_id, result) => {
    let query = `UPDATE activities 
    SET active = false
    WHERE id = ${activity_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deactivated failed.' });
    });
};

Activities.getAllFilterScores = (user_id, limit_number, result) => {

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
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'No score action yet.' });
    });

};

Activities.getAllFilterComments = (user_id, limit_number, result) => {

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
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows);
        else
            result(null, { notification: 'No comment action yet.' });
    });

};

module.exports= Activities;

