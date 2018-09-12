'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    pin: {
        type: String, 
        min: 0,
        max: 100
    },
    guestId: {
        type: String
    },
    guestComment: {
        type: String
    },
    timestamp: {
        type: String
    }
});

module.exports = mongoose.model('Comments', CommentSchema);