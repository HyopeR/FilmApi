const db = require('../helpers/db');

let Rooms = function(name, active = true){
    this.name = name;
    this.active = active;
};

Rooms.getAll = result => {
    let query = `
    SELECT 
        rooms.id,
        rooms.name,
        rooms.active,
        rooms.created_at,
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

        result(null, res.rows);
    });
};

Rooms.getOne = (room_id, result) => {
    let query = `
     SELECT 
        rooms.id,
        rooms.name,
        rooms.active,
        rooms.created_at,
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

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Not available ID.' });
    });
};

Rooms.create = (newRoom, result) => {

    let query = `INSERT INTO rooms (name, active) 
    VALUES( $1, $2 ) RETURNING *`;

    const { name, active } = newRoom;

    db.query(query, [name, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Adding failed.' });
    });
};

Rooms.update = (room_id, newRoom, result) => {
    let query = `UPDATE rooms 
    SET name = $1,
        active = $2
    WHERE id = ${room_id} RETURNING *`;

    const { name, active } = newRoom;

    db.query(query, [name, active], (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Update failed.' });

    });
};

Rooms.deactivate = (room_id, result) => {
    let query = `UPDATE rooms 
    SET active = false
    WHERE id = ${room_id} RETURNING *`;
    db.query(query, (err, res) => {
        if (err)
            result(null, err);

        if(res.rows.length > 0)
            result(null, res.rows[0]);
        else
            result(null, { notification: 'Deactivated failed.' });
    });
};

module.exports= Rooms;


