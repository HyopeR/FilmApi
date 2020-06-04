const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: {
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        detail: {type: Schema.Types.String}
    }
});

module.exports = mongoose.model('Comment', commentSchema);
