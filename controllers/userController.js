'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('Users')

exports.list_all_users = function (req, res) {

    User.find({}, function (err, user) {
        if (err)
            res.status(500).send(err);
        res.status(200).json(user);
    });
};

exports.create_a_user = function (req, res) {

    User.find({ email: req.body.email }, function (err, user) {
        if (err) {
            res.status(500).send({ message: 'Ocorreu um erro ao cadastrar' });
        }
        if (!user.length) {
            var new_user = new User(req.body);

            new_user.save(function (err, user) {
                if (err)
                    res.status(500).send({ message: 'Não foi possível criar usuário.' });
                res.status(200).json(user._id);
            });
        }
        else {
            res.status(500).json({ message: 'Usuário já existe com esse email.' });
        }
    })
};

exports.delete_a_user = function (req, res) {

    User.remove({ pin: req.params.userId }, function (err, user) {
        if (err)
            res.status(500).send('Não foi possível deletar o usuário.');
        res.status(200).json(user);
    });
};

exports.login_a_user = function (req, res) {

    User.find({ email: req.body.email, password: req.body.password }, function (err, user) {
        if (err)
            res.status(500).send('Usuário não existe.');
        res.status(200).send(user[0]._id);
    })
}