const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: Schema.Types.String,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: true
    },
    surname: {
        type: Schema.Types.String,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true,
        minlength: [6, "Şifre 3 Karakterden uzun olmalı"],
        maxlength: [55, "Şifre 255 Karakterden kısa olmalı"]
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
        trim: true
    },
    friends: [{type: Schema.Types.ObjectId, ref: 'Friends'}],
    lists: [
        {type: Schema.Types.ObjectId, ref: 'Film'},
        // {type: Schema.Types.ObjectId, ref: 'Series'},
    ],
    rooms: [{type: Schema.Types.ObjectId, ref: 'Room'}]
});

module.exports = mongoose.model('User', userSchema);
