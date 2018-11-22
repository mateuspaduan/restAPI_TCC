'use strict';

var mongoose = require('mongoose'),
Session = mongoose.model('Sessions'),
User = mongoose.model('Users');

exports.list_user_sessions = (req, res) => {

    let userId = req.headers.authorization;

    User.findById(userId, (err, user) => {
        if (err) res.status(500).send(err);
        if (!user) res.status(404).send({ message: 'Usuário não está cadastrado' });
        if (user) {
            Session.find({ owner: userId }, (err, sessions) => {
                if (err || !sessions.length) {
                    res.status(404).send({ message: 'Não existem sessões criadas por esse usuário.' });
                }
                if (sessions.length) {
                    res.status(200).send(sessions);
                }
            })
        }
    })
};

exports.list_active_sessions = function (req, res) {

    Session.find({ isActive: true }, function (err, sessions) {

        if (err || !sessions.length) res.status(500).send(err);
        if (!sessions.length) res.status(404).send(
            { message:'Não existem sessões ativas.' }
        );
        if (sessions.length) {
            res.status(200).send(sessions);
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
        if (err) res.status(500).send(err); 
        if (!user) res.status(500).json({ message: 'Usuário não existe.' });
        if (user) {
            new_session.save(function (err) {
                if (err) {
                    res.status(500).json({ message: 'Erro ao criar sessão.' });
                }
            });
            if (user.pinSession) {
                let conditions = { pin: user.pinSession, owner: user._id };
                let deactivateSession = { $set: { isActive: false }};
                Session.findOneAndUpdate(conditions, deactivateSession, () => {});
            }
            user.update({ $set: { pinSession: new_session.pin } }, (err) => {
                if (err) {
                    res.status(500).send('Erro ao entrar na sessão!');
                }
                res.status(200).send();
            })
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
}

exports.leave_session = function (req, res) {

    let sessionName = req.params.sessionName;

    Session.find({ pin: sessionName, isActive: true }, function (err, session) {
        if (err || !session.length) {
            res.status(500).send('Sessão não existe ou não está ativa.');
        }
        if (session.length) {
            Session.update({ pin: sessionName }, { $set: { isActive: false }}, function (err, session) {
                if (err) {
                    res.status(500).send('Algo de errado ocorreu');
                }
            })
            res.status(200).send(); 
        }
    })
}

exports.add_a_guest = function (req, res) {

    let sessionId = req.params.sessionId

    Session.find({ pin: sessionId, isActive: true }, function (err, session) {
        if (err || !session.length) {
            res.status(500).send('Sessão não existe ou não está ativa.');
        }
        if (session.length) {
            let updateUserSession = { $set: { pinSession: sessionId }};
            User.findOneAndUpdate({_id: req.headers.authorization }, updateUserSession,
                (err, user) => {
                    if (err) {
                        res.status(500).send('Usuário não está cadastrado.');
                    }
                    if (user.pinSession && user.pinSession != sessionId) {
                        let conditions = { pin: user.pinSession, owner: user._id };
                        let deactivateSession = { $set: { isActive: false }};
                        Session.findOneAndUpdate(conditions, deactivateSession, () => {});
                    }
            });
            res.status(200).send(); 
        }
    })
}

// utils
exports.delete_all = (req, res) => {
    Session.remove({}, (err, res) => {
        
        if (err) return res.send(500);
        return res.send(204);
    })
}