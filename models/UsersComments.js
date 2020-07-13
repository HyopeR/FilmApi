const db = require('../helpers/db');

let UsersComments = function(user_id, content_detail_id, detail){
    this.user_id = user_id;
    this.content_detail_id = content_detail_id;
    this.detail = detail;
};

UsersComments.getAll = result => {
    let query = `SELECT * FROM users_comments`;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

UsersComments.getAllContentDetailComments = (content_detail_id, limit_number, result) => {
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
        contents_details.content_id
    FROM users_comments
    
    LEFT JOIN users
    ON users_comments.user_id = users.id
    
    LEFT JOIN contents_details
    ON users_comments.content_detail_id = contents_details.id
    
    WHERE contents_details.id = ${content_detail_id}
    
    ORDER BY users_comments.created_at DESC
    LIMIT ${limit_number}
    `;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows);
        else
            result(null, { notification: 'This content has no comments yet.' });
    });
};

UsersComments.getOne = (user_comment_id, result) => {
    let query = `SELECT * FROM users_comments WHERE id = ${user_comment_id}`;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

UsersComments.create = (newUserComment, result) => {

    let query = `INSERT INTO users_comments (user_id, content_detail_id, detail) 
    VALUES( $1, $2, $3 ) RETURNING *`;

    const { user_id, content_detail_id, detail } = newUserComment;

    db.query(query, [user_id, content_detail_id, detail], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

UsersComments.update = (user_comment_id, updateUserComment, result) => {
    let query = `UPDATE users_comments 
    SET detail = $1,
        updated_at = $2
   WHERE id = ${user_comment_id} RETURNING *`;

    // updateUserComment = { detail, updated_at }
    const { detail, updated_at } = updateUserComment;

    db.query(query, [detail, updated_at], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

UsersComments.delete = (user_comment_id, result) => {
    let query = `DELETE FROM users_comments WHERE id = ${user_comment_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deleted failed.' });
    });
};

module.exports= UsersComments;




