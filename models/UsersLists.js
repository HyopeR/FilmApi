const db = require('../helpers/db');

let UsersLists = function(user_id, content_id){
    this.user_id = user_id;
    this.content_id = content_id;
};

UsersLists.getAll = result => {
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
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

UsersLists.getOne = (user_id, result) => {
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
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

UsersLists.create = (newUserList, result) => {

    let query = `INSERT INTO users_lists (user_id, content_id) 
    VALUES( $1, $2 ) RETURNING *`;

    const { user_id, content_id } = newUserList;

    db.query(query, [user_id, content_id], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

UsersLists.delete = (user_id, content_id, result) => {
    let query = `DELETE FROM users_lists 
    WHERE user_id = ${user_id} AND content_id = ${content_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deletion failed.' });
    });
};

module.exports= UsersLists;
