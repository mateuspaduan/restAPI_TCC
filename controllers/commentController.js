'use strict';

var mongoose = require('mongoose'),
Session = mongoose.model('Sessions'),
Comment = mongoose.model('Comments');

exports.list_all_comments = function (req, res) {

    Comment.find({}, function (err, comment) {
        if (err)
            res.send(err);
        res.json(comment);
    });
};

exports.list_pin_comments = function (req, res) {

    Comment.find( { pin: req.params.pin }, function(err, comment) {

        if(err){
            res.send(err);
        }

        if(comment.length){
            res.json(comment);
        }
    })
}

exports.create_a_comment = function (req, res) {

    Session.find({ pin: req.params.sessionId, guests: { "$in": [req.params.guestId] } }, function (err, comment) {
        
        if (err)
            res.send(err);

        if(comment.length){

            var new_comment = new Comment(req.body);
            new_comment.save(function (err, comment) {
                if (err)
                    res.send(err);
                res.json(comment);
            });
        }

        else{

            res.json({ message: 'Not in the session' });
        }
    });
};

exports.delete_a_comment = function (req, res) {

    Comment.remove({ pin: req.params.guestId }, function (err, session) {
        if (err)
            res.send(err);
        res.json({ message: 'Task successfully deleted' });
    });
}