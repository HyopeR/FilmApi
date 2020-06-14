const db = require('../helpers/db');

let UsersRooms = function(user_id, room_id, authority = 0){
    this.user_id = user_id;
    this.room_id = room_id;
    this.authority = authority;
};
