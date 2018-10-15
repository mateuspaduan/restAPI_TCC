'use strict';
module.exports = function (app) {
    var sessionController = require('../controllers/sessionController');
    var commentController = require('../controllers/commentController');
    var userController = require('../controllers/userController')

    // todoList Routes
    app.route('/sessions')
        .get(sessionController.list_all_sessions)
        .post(sessionController.create_a_session);

    app.route('/sessions/:sessionId/', function (req, res) {
        res.send(req.params.sessionId);
    })
        .put(sessionController.add_a_guest)
        .delete(sessionController.delete_a_session);

    app.route('/sessions/:sessionId/:guestId', function (req, res) {
        res.send(req.params.sessionId);
        res.send(req.params.guestId);
    })
        .put(sessionController.add_a_guest);

    app.route('/comments')
        .get(commentController.list_all_comments)
        .post(commentController.create_a_comment);

    app.route('/comments/:pin', function (req, res) {
        res.send(req.params.pin);
    })
        .get(commentController.list_pin_comments);    

    app.route('/comments/:guestId')
        .delete(commentController.delete_a_comment);

    app.route('/users')
        .get(userController.list_all_users)
        .post(userController.create_a_user);

    app.route('/users/:userId/', function (req, res) {
        res.send(req.params.userId);
    })
        .delete(userController.delete_a_user);
};