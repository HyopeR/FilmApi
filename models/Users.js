const db = require('../helpers/db');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let Users = function(username, name, surname, email, password, active = true){
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.active = active;
};

const getQueryRoofDynamic = (parameterString) => {
    let createdQuery = `SELECT 
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
    `
    ;

    return createdQuery;
};

Users.getAll = result => {
    let query = getQueryRoofDynamic(``);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Users.getAllActive = result => {
    let query = getQueryRoofDynamic(
        `WHERE users.active = true`);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Users.getOne = (user_id, result) => {
    let query = getQueryRoofDynamic(
        `WHERE users.id = ${user_id}`);
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Users.update = (user_id, newUser, result) => {
    let query = `UPDATE users 
    SET username = $1, 
        name = $2,
        surname = $3,
        email = $4,
        password = $5,
        active = $6
    WHERE id = ${user_id} RETURNING *`;

    let { username, name, surname, email, password, active } = newUser;

    bcrypt.hash(password, 10).then((hash) => {

        db.query(query, [username, name, surname, email, hash, active], (err, res) => {
            if (err)
                result(null, err);

            if(res.rowCount > 0)
                result(null, res.rows[0]);
            else
                result(null, { notification: 'Update failed.' });

        });

    });
};

Users.deactivate = (user_id, result) => {
    let query = `UPDATE users
    SET active = false
    WHERE id = ${user_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deactivated failed.' });
    });
};

module.exports= Users;
