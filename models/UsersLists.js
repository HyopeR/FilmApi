const db = require('../helpers/db');

let UsersLists = function(user_id, content_id){
    this.user_id = user_id;
    this.content_id = content_id;
};

UsersLists.getAll = result => {
    let query = `SELECT * FROM users_lists`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

UsersLists.getOne = (user_id, result) => {
    let query = `SELECT * FROM users_lists WHERE user_id = ${user_id}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
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

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

UsersLists.update = (param_user_id, param_content_id, newUserList, result) => {
    let query = `UPDATE users_lists 
    SET user_id = $1, 
        content_id = $2
    WHERE user_id = ${param_user_id} AND content_id = ${param_content_id} RETURNING *`;

    const { user_id, content_id } = newUserList;

    db.query(query, [user_id, content_id], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

UsersLists.delete = (user_id, content_id, result) => {
    let query = `DELETE FROM users_lists 
    WHERE user_id = ${user_id} AND content_id = ${content_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deletion failed.' });
    });
};

module.exports= UsersLists;
