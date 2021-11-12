const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

const user = mongoose.model('user', UserSchema);

module.exports = user;