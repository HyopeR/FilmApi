const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new Schema({
    requester: {type: Schema.Types.ObjectId, ref: 'User'},
    recipient: {type: Schema.Types.ObjectId, ref: 'User'},
    status: {
        type: Schema.Types.Number, // 0 'add friend', 1 'requested', 2 'pending', 3 'friends'
    }
}, {timestamps: true});

module.exports = mongoose.model('Friend', friendSchema);
