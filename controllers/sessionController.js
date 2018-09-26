'use strict';

var mongoose = require('mongoose'),
Session = mongoose.model('Sessions'),
User = mongoose.model('Users');

exports.list_all_sessions = function (req, res) {

    Session.find({}, function (err, session) {
        if (err)
            res.status(500).send(err);
        res.status(200).json(session);
    });
};

exports.create_a_session = function (req, res) {

    var new_session = new Session(req.body);
    User.find({ email: req.body.owner, isUser: false }, function(err, session){

        if(err){
            res.status(500).send(err);
        }

        if(session.length){
            new_session.save(function (err, task) {
                if (err)
                    res.status(500).send(err);
                res.status(200).json(task);
            });
        }
    })
};

exports.delete_a_session = function (req, res) {

    Session.remove({ pin: req.params.sessionId }, function (err, session) {
        if (err)
            res.status(500).send(err);
        res.status(200).json(session);
    });
}

exports.add_a_guest = function (req, res) {

    var sessionKey = { pin: req.params.sessionId };
    var update = { $push: { guests: req.params.guestId } };
    Session.update(sessionKey, update, function(err, session) {
        if(err)
            res.status(500).send(err);
        res.status(200).send(session);    
    });
}