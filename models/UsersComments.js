const db = require('../helpers/db');

let UsersComments = function(user_id, content_detail_id, detail){
    this.user_id = user_id;
    this.content_detail_id = content_detail_id;
    this.detail = detail;
};
