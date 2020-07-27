const db = require('../helpers/db');

let Friends = function(requester_id, recipient_id, status = 0){
    this.requester_id = requester_id;
    this.recipient_id = recipient_id;
    this.status = status;
};

Friends.getAll = result => {
    let query = `SELECT * FROM friends ORDER BY id`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Friends.getAllOneUserFriends = (user_id, result) => {
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
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};


Friends.getOne = (friend_record_id, result) => {
    let query = `SELECT * FROM friends 
    WHERE id = ${friend_record_id}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);

        else
            result(null, { notification: 'Not available ID.' });
    });
};

Friends.create = (newFriend, result) => {

    let query = `INSERT INTO friends (requester_id, recipient_id, status) 
    VALUES( $1, $2, $3 ) RETURNING *`;

    const {requester_id, recipient_id, status} = newFriend;

    db.query(query, [requester_id, recipient_id, status], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

Friends.update = (friend_record_id, updateFriend, result) => {

    // status, created_at = updateFriend
    let query = `UPDATE friends 
    SET status = $1,
        updated_at = $2
    WHERE id = ${friend_record_id} RETURNING *`;

    const {status, updated_at } = updateFriend;

    db.query(query, [status, updated_at], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

Friends.delete = (friend_record_id, result) => {
    let query = `DELETE FROM friends 
    WHERE id = ${friend_record_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deletion failed.' });
    });
};

module.exports= Friends;
