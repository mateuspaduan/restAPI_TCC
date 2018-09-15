'use strict';
module.exports = function (app) {
    var sessionController = require('../controllers/sessionController');
    var commentController = require('../controllers/commentController');

    // todoList Routes
    app.route('/sessions')
        .get(sessionController.list_all_sessions)
        .post(sessionController.create_a_session);

    app.route('/sessions/:sessionId/', function (req, res) {
        res.send(req.params.sessionId);
    })
        .delete(sessionController.delete_a_session);

    app.route('/sessions/:sessionId/:guestId', function (req, res) {
        res.send(req.params.sessionId);
        res.send(req.params.guestId);
    })
        .put(sessionController.add_a_guest);

    app.route('/comments')
        .get(commentController.list_all_comments)
        .post(commentController.create_a_comment);;

    app.route('/comments/:guestId')
        .delete(commentController.delete_a_comment);    

    app.route('/comments/:sessionId/:guestId', function (req, res) {
        res.send(req.params.sessionId);
        res.send(req.params.guestId);
    })
        .post(commentController.create_a_comment);
};