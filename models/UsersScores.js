const db = require('../helpers/db');

let UsersScores = function(user_id, content_id, score){
    this.user_id = user_id;
    this.content_id = content_id;
    this.score = score;
};

UsersScores.getAll = result => {
    let query = `SELECT * FROM users_scores`;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

UsersScores.getOne = (user_id, content_id, result) => {
    let query = `SELECT * FROM users_scores WHERE user_id = ${user_id} AND content_id = ${content_id}`;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

UsersScores.create = (newUserScore, result) => {

    let query = `INSERT INTO users_scores (user_id, content_id, score) 
    VALUES( $1, $2, $3 ) RETURNING *`;

    const { user_id, content_id, score } = newUserScore;

    db.query(query, [user_id, content_id, score], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

UsersScores.update = (user_id, content_id, updateUserScore, result) => {
    let query = `UPDATE users_scores 
    SET score = $1,
        updated_at = $2
    WHERE user_id = ${user_id} AND content_id = ${content_id} RETURNING *`;

    // updateUserScore = { score, updated_at }
    const { score, updated_at } = updateUserScore;

    db.query(query, [score, updated_at], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

UsersScores.delete = (user_id, content_id, result) => {
    let query = `DELETE FROM users_scores WHERE user_id = ${user_id} AND content_id = ${content_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deleted failed.' });
    });
};

module.exports= UsersScores;



