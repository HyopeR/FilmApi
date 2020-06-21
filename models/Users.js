const db = require('../helpers/db');

let Users = function(username, name, surname, email, password, active = true){
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.active = active;
};

Users.getAll = result => {
    let query = `
    SELECT 
        users.id,
        users.username,
        users.name,
        users.surname,
        users.password,
        users.active,
        users.created_at,
        COALESCE( lists, ARRAY[]::json[] ) as lists
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
        )) as lists
        FROM users_lists
        
        LEFT JOIN contents
        ON users_lists.content_id = contents.id
        
        LEFT JOIN contents_types
        ON contents.type_id = contents_types.id
        
        GROUP BY users_lists.user_id
        ORDER BY users_lists.user_id
    ) AS lists
    
    ON users.id = lists.user_id
    `;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

Users.getOne = (user_id, result) => {
    let query = `
    SELECT 
        users.id,
        users.username,
        users.name,
        users.surname,
        users.password,
        users.active,
        users.created_at,
        COALESCE( lists, ARRAY[]::json[] ) as lists
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
        )) as lists
        FROM users_lists
        
        LEFT JOIN contents
        ON users_lists.content_id = contents.id
        
        LEFT JOIN contents_types
        ON contents.type_id = contents_types.id
        
        GROUP BY users_lists.user_id
        ORDER BY users_lists.user_id
    ) AS lists
    
    ON users.id = lists.user_id
    WHERE users.id = ${user_id}
    `;
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
