const db = require('../helpers/db');

let UsersLists = function(user_id, content_id){
    this.user_id = user_id;
    this.content_id = content_id;
};
