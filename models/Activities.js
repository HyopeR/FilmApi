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

Activities.getOne = (activity_id, result) => {
    let query = `SELECT * FROM activities WHERE id = ${activity_id}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
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
    SET activity_start = $1 ,
        activity_finish = $2,
        activity_score = $3,
        activity_comment = $4,
        activity_passing_time = $5,
        updated_at = $6
    WHERE id = ${activity_id} RETURNING *`;

    const { activity_start, activity_finish, activity_score, activity_comment, activity_passing_time, updated_at } = updateActivity;

    db.query(query, [activity_start, activity_finish, activity_score, activity_comment, activity_passing_time, updated_at], (err, res) => {
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

module.exports= Activities;

