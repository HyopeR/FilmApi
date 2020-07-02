const db = require('../helpers/db');

let UsersRooms = function(user_id, room_id, authority = 0){
    this.user_id = user_id;
    this.room_id = room_id;
    this.authority = authority;
};

UsersRooms.getAll = result => {
    let query = `SELECT * FROM users_rooms`;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        result(null, res.rows);
    });
};

UsersRooms.getOneRoomUsers = (room_id, result) => {
    let query = `
    SELECT 
        rooms.id,
        rooms.name,
        array_agg( json_build_object(
                            'id', users.id,
                            'username', users.username,
                            'name', users.name,
                            'surname', users.surname,
                            'authority', users_rooms.authority,
                            'joined_at', users_rooms.created_at
        ) ORDER BY users.id ASC ) as user_list
        
        FROM rooms
        
        LEFT JOIN users_rooms
        ON rooms.id = users_rooms.room_id
        
        LEFT JOIN users
        ON users_rooms.user_id = users.id
        
        WHERE rooms.id = ${room_id}
        
        GROUP BY 
            rooms.id, 
            rooms.name,
            rooms.active,
            rooms.created_at
        
        ORDER BY rooms.id
    `;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

UsersRooms.getOneUserRooms = (user_id, result) => {
    let query = `
    SELECT
        users.id,
        users.username,
        array_agg(
            json_build_object(
                'id', rooms.id,
                'name', rooms.name,
                'authority', users_rooms.authority,
                'joined_at', users_rooms.created_at
            ) ORDER BY rooms.id ASC 
        ) as rooms
        
        FROM users
        
        LEFT JOIN users_rooms
        ON users.id = users_rooms.user_id
        
        LEFT JOIN rooms
        ON users_rooms.room_id = rooms.id
        
        WHERE users.id IN (SELECT user_id FROM users_rooms)
        AND users.id = ${user_id}
        
        GROUP BY users.id
        ORDER BY users.id
    `;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

UsersRooms.getOne = (user_id, room_id, result) => {
    let query = `SELECT * FROM users_rooms WHERE user_id = ${user_id} AND room_id = ${room_id}`;

    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

UsersRooms.create = (newUserRoom, result) => {

    let query = `INSERT INTO users_rooms (user_id, room_id, authority) 
    VALUES( $1, $2, $3 ) RETURNING *`;

    const { user_id, room_id, authority } = newUserRoom;

    db.query(query, [user_id, room_id, authority], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

UsersRooms.update = (user_id, room_id, updateUserRoom, result) => {
    let query = `UPDATE users_rooms 
    SET authority = $1
    WHERE user_id = ${user_id} AND room_id = ${room_id} RETURNING *`;

    // updateUserRoom = { authority }
    const { authority } = updateUserRoom;

    db.query(query, [authority], (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

UsersRooms.delete = (user_id, room_id, result) => {
    let query = `DELETE FROM users_rooms WHERE user_id = ${user_id} AND room_id = ${room_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rowCount > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deleted failed.' });
    });
};

module.exports= UsersRooms;


