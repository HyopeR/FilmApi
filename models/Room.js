const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomName: {type: Schema.Types.String, required: true},
    // contentID: {type: Schema.Types.ObjectID, required: true},
    film: {type: Schema.Types.ObjectId, ref: 'Film'},
    series: {type: Schema.Types.ObjectId, ref: 'Series'},
    passingTime: 0,
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    admin: {type: Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true});

module.exports = mongoose.model('Room', roomSchema);
