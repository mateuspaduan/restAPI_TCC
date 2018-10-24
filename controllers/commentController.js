'use strict';

var mongoose = require('mongoose'),
Session = mongoose.model('Sessions'),
Comment = mongoose.model('Comments'),
User = mongoose.model('Users');

exports.list_all_comments = function (req, res) {

    Comment.find({}, function (err, comment) {
        if (err)
            res.status(500).send(err);
        res.status(200).json(comment);
    });
};

exports.list_pin_comments = function (req, res) {

    Comment.find( { pin: req.params.pin }, function(err, comment) {
        if(err || !comment.length){
            res.status(500).send(err);
        }
        if(comment.length){
            res.status(200).send(comment);
        }
    })
}

exports.create_a_comment = (req, res) => {

    let new_comment = new Comment(req.body);
    let userId = req.headers.authorization

    if (userId) {
        User.findById(userId, (err, user) => {
            if (err || !user) {
                res.status(401).send({ message: "Usuário não encontrado"})
            }
            if (user.pinSession == req.body.pin) {
                new_comment.save((err) => {
                    if (err)
                        res.status(500).send(err);
                    res.status(200).send();
                });
            } else {
                res.status(500).json({ message: "Usuário não conectado à sessão" })
            }
        });
    } else {
        new_comment.save((err) => {
            if (err)
                res.status(500).send(err);
            res.status(200).send();
        });
    }
};

exports.delete_a_comment = function (req, res) {

    Comment.remove({ pin: req.params.guestId }, function (err, session) {
        if (err)
            res.status(500).send(err);
        res.status(200).json({ message: 'Task successfully deleted' });
    });
}

// utils
exports.delete_all = (req, res) => {
    Comment.remove({}, (err, res) => {
        if (err) return res.send(500);
        return res.send(204);
    })
}