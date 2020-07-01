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
