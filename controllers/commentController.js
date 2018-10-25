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

exports.list_pin_comments = (req, res) => {

    Comment.find( { pin: req.params.pin }, (err, comment) => {
        if (err) res.status(500).send(err);
        if (!comment.length) res.status(404).send(
            { message: "Ainda não há reações para essa sessão!"}
        );
        if (comment.length) res.status(200).send(comment);
    })
}

exports.create_a_comment = async (req, res) => {

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
                });
            } else {
                res.status(500).json({ message: "Usuário não conectado à sessão" })
            }
        });
    } else {
        new_comment.save((err) => {
            if (err)
                res.status(500).send(err);
        });
    }
    var comments = await sessionCommentPercentage(req.body.pin);
    let total = comments.loving + comments.whatever + comments.hating
    for (var key in comments) {
        comments[key] /= total
    }
    res.status(200).send(comments);
};

async function sessionCommentPercentage(pin) {
    var commentsCount = {
        loving: 0.0,
        whatever: 0.0,
        hating: 0.0
    };
    await Comment.find({ pin: pin, guestComment: "LOVING" }, (err, comments) => {
        commentsCount.loving = comments.length;
    });
    await Comment.find({ pin: pin, guestComment: "WHATEVER" }, (err, comments) => {
        commentsCount.whatever = comments.length;
    });
    await Comment.find({ pin: pin, guestComment: "HATING" }, (err, comments) => {
        commentsCount.hating = comments.length;
    });
    return await commentsCount
}

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