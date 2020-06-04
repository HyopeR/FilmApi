const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    // contentID: {type: Schema.Types.ObjectID, required: true},
    film: {type: Schema.Types.ObjectId, ref: 'Film'},
    series: {type: Schema.Types.ObjectId, ref: 'Series'},
    isOne: false,
    activity: {
        start: false,
        finish: false,
        score: false,
        comment: false,
        passingTime: 0
    },
    detail: {
        score: {type: Schema.Types.ObjectId, ref: 'Score'},
        comment: {type: Schema.Types.ObjectId, ref: 'Comment'}
    }

}, {timestamps: true});

module.exports = mongoose.model('Activity', activitySchema);
