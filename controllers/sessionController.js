'use strict';

var mongoose = require('mongoose'),
Session = mongoose.model('Sessions'),
User = mongoose.model('Users');

exports.list_user_sessions = function (req, res) {

    let userId = req.headers.authorization;

    User.find({ _id: userId }, function (err, user) {
        if (err) {
            res.status(500).send('Usuário não está cadastrado');
        }
        if (user.length()) {
            Session.find({ owner: userId }, function (err, session) {
                if (err) {
                    res.status(500).send('Não existem sessões criadas por esse usuário.');
                }
                if (session.length()) {
                    res.status(200).send(session[0].pin);
                }
            })
        }
    })
};

exports.create_a_session = function (req, res) {

    var new_session = new Session(req.body);
    User.find({ email: req.body.owner }, function (err, user) {
        if(err){
            res.status(500).send('Usuário não existe.');
        }
        if(user.length){
            new_session.save(function (err, task) {
                if (err)
                    res.status(500).send('Erro ao criar sessão.');
                res.status(200).send('Sessão criada com sucesso.');
            });
        }
    })
};

exports.disable_a_session = function (req, res) {

    Session.find({ owner: req.headers.authorization }, function (err, session) {
        if (err) {
            res.status(500).send('Algo de errado ocorreu');
        }
        if (session.length()) {
            Session.update({ owner: req.headers.authorization }, { $set: { active: false }}, function (err, session) {
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

    Session.find({ pin: req.params.sessionId}, function (err, session) {
        if (err) {
            res.status(500).send('Sessão não existe ou não está ativa.');
        }
        if (session.length()) {
            User.find({_id: req.headers.authorization }, function (err, user) {
                if (err) {
                    res.status(500).send('Usuário não está logado.');
                }
                if (user.length()) {
                    if (session.length()) {
                        User.update({ _id: req.headers.authorization }, { $set: { pinSession: req.params.sessionId } }, function (err, user){
                            if (err){
                                res.status(500).send('Usuário não está cadastrado.');
                            }
                        }) 
                    }
                }
                res.status(200).send('Usuário adicionado à sessão.');
            })    
        }
    })
}