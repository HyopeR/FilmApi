const db = require('../helpers/db');

let RoomsActivities = function(room_id, activity_id){
    this.room_id = room_id;
    this.activity_id = activity_id;
};

RoomsActivities.getAll = result => {
    let query = `SELECT * FROM rooms_activities`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

RoomsActivities.getOne = (room_id, activity_id, result) => {
    let query = `SELECT * FROM rooms_activities WHERE room_id = ${room_id} AND activity_id = ${activity_id}`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

RoomsActivities.create = (newRoomActivity, result) => {
    let query = `INSERT INTO 
    rooms_activities (room_id, activity_id) 
    VALUES( $1, $2 ) RETURNING *`;

    const { room_id, activity_id } = newRoomActivity;

    db.query(query, [room_id, activity_id ], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

module.exports= RoomsActivities;
