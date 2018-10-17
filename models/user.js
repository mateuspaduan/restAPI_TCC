'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },

    password: {
        type: String
    },

    pinSession: {
        type: String
    }
});

module.exports = mongoose.model('Users', UserSchema);