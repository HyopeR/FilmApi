const db = require('../helpers/db');

let Friends = function(requester_id, recipient_id, status = 0){
    this.requester_id = requester_id;
    this.recipient_id = recipient_id;
    this.status = status;
};
