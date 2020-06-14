const db = require('../helpers/db');

let RoomsActivities = function(room_id, activity_id){
    this.room_id = room_id;
    this.activity_id = activity_id;
};

