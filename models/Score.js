const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Score = new Schema({
    score: {
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        detail: {type: Schema.Types.String}
    }
})

module.exports = mongoose.model('Score', Score);