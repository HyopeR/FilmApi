const db = require('../helpers/db');

let UsersActivities = function(user_id, activity_id){
    this.user_id = user_id;
    this.activity_id = activity_id;
};
