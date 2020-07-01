const db = require('../helpers/db');

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
        users.name,
        users.surname,
        users.password,
        users.active,
        users.created_at,
        COALESCE( lists, ARRAY[]::json[] ) as lists,
        COALESCE( friends, ARRAY[]::json[] ) as friends
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

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Users.create = (newUser, result) => {

    let query = `INSERT INTO users (username, name, surname, email, password, active) 
    VALUES( $1, $2, $3, $4, $5, $6 ) RETURNING *`;

    const { username, name, surname, email, password, active } = newUser;

    db.query(query, [username, name, surname, email, password, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
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

    const { username, name, surname, email, password, active } = newUser;

    db.query(query, [username, name, surname, email, password, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

Users.deactivate = (user_id, result) => {
    let query = `UPDATE users 
    SET active = false
    WHERE id = ${user_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deactivated failed.' });
    });
};

module.exports= Users;
