'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema({
    pin: {
        type: String, 
        min: 0,
        max: 100
    },
    time: {
        type: String
    },
    owner: {
        type: String
    },
    guests: [String]
});

module.exports = mongoose.model('Sessions', SessionSchema);