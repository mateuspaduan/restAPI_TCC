'use strict';

var mongoose = require('mongoose'),
Session = mongoose.model('Sessions'),
User = mongoose.model('Users');

exports.list_user_sessions = function (req, res) {

    let userId = req.headers.authorization;

    User.findById(userId, function (err, user) {
        if (err || !user) {
            res.status(404).send({ message:'Usuário não está cadastrado' });
        }
        if (user) {
            Session.find({ owner: userId }, function (err, sessions) {

                if (err || !sessions.length) {
                    res.status(404).send({ message:'Não existem sessões criadas por esse usuário.' });
                }
                if (sessions.length) {
                    res.status(200).send(sessions);
                }
            })
        }
    })
};

exports.create_a_session = function (req, res) {

    let userId = req.headers.authorization;
    var new_session = new Session({
        pin: req.body.pin,
        time: req.body.time,
        owner: userId,
        isActive: req.body.isActive
    });

    User.findById(userId, function (err, user) {
        if (err || !user) {
            res.status(500).json({ message: 'Usuário não existe.' });
        }
        if (user) {
            new_session.save(function (err) {
                if (err) {
                    res.status(500).json({ message: 'Erro ao criar sessão.' });
                }
                res.status(200).send();
            });
        }
    })
};

exports.disable_a_session = function (req, res) {

    let userId = req.headers.authorization;
    Session.findById(userId, function (err, session) {
        if (err || !session) {
            res.status(500).send('Algo de errado ocorreu');
        }
        if (session) {
            Session.update({ owner: userId }, { $set: { isActive: false }}, function (err, session) {
                if (err) {
                    res.status(500).send('Algo de errado ocorreu');
                }
                res.status(200).send('A sessão foi desativada.');
            })
        }
    })

    // Session.remove({ pin: req.params.sessionId }, function (err, session) {
    //     if (err)
    //         res.status(500).send('Não foi possivel deletar a sessão.');
    //     res.status(200).send(session);
    // });
}

exports.add_a_guest = function (req, res) {

    let sessionId = req.params.sessionId

    Session.find({ pin: sessionId }, function (err, session) {
        if (err || !session.length) {
            res.status(500).send('Sessão não existe ou não está ativa.');
        }
        if (session.length) {
            User.findOneAndUpdate({_id: req.headers.authorization },
                { $set: { pinSession: sessionId } }, (err) => {
                    if (err) {
                        res.status(500).send('Usuário não está cadastrado.');
                    }
            })
            res.status(200).send(); 
        }
    })
}