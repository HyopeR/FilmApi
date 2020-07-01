const db = require('../helpers/db');

let Friends = function(requester_id, recipient_id, status = 0){
    this.requester_id = requester_id;
    this.recipient_id = recipient_id;
    this.status = status;
};

Friends.getAll = result => {
    let query = `SELECT * FROM friends`;
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
        users.username,
        users.name,
        users.surname,
        COALESCE( friends, ARRAY[]::json[] ) as friends
    FROM users
    
    LEFT JOIN
    (
        SELECT 
            users.id,
            array_agg(friends.friend) as friends
            FROM users

        LEFT JOIN
        (
            SELECT 
                users.id,
                CASE
                    WHEN users.id = friend_selector.requester_id THEN friend_selector.recipient_user
                    WHEN users.id = friend_selector.recipient_id THEN friend_selector.requester_user

                END AS friend FROM users

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
            WHERE ( 
                users.id IN (SELECT requester_id FROM friends)
                OR users.id IN (SELECT recipient_id FROM friends) 
               )
        ) AS friends
        ON friends.id = users.id
        WHERE users.id IN (friends.id)
        GROUP BY users.id
        ORDER BY users.id

    ) AS friends
    ON users.id = friends.id
    WHERE users.id = ${user_id}
    ORDER BY users.id
    `;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};


Friends.getOne = (requester_id, recipient_id, result) => {
    let query = `SELECT * FROM friends 
    WHERE requester_id = ${requester_id} AND recipient_id = ${recipient_id}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
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

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

Friends.update = (requester_id, recipient_id, updateFriend, result) => {

    // status, created_at = updateFriend
    let query = `UPDATE friends 
    SET status = $1,
        updated_at = $2
    WHERE requester_id = ${requester_id} AND recipient_id = ${recipient_id} RETURNING *`;

    const {status, updated_at } = updateFriend;

    db.query(query, [status, updated_at], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

Friends.delete = (requester_id, recipient_id, result) => {
    let query = `DELETE FROM friends 
    WHERE requester_id = ${requester_id} AND recipient_id = ${recipient_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deletion failed.' });
    });
};

module.exports= Friends;
