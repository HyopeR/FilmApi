const db = require('../helpers/db');

let UsersActivities = function(user_id, activity_id){
    this.user_id = user_id;
    this.activity_id = activity_id;
};

UsersActivities.getAll = result => {
    let query = `SELECT * FROM users_activities`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

UsersActivities.getOne = (user_id, activity_id, result) => {
    let query = `SELECT * FROM users_activities WHERE user_id = ${user_id} AND activity_id = ${activity_id}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

UsersActivities.create = (newUserActivity, result) => {
    let query = `INSERT INTO 
    users_activities (user_id, activity_id) 
    VALUES( $1, $2 ) RETURNING *`;

    const { user_id, activity_id } = newUserActivity;

    db.query(query, [user_id, activity_id ], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

module.exports= UsersActivities;


