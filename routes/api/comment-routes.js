const router = require('express').Router();
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controllers');
const { route } = require('./pizza-routes');

router
    .route('/:pizzaId')
    .post(addComment);

router
    .route('/:pizzaId/:commentId')
    // the callback function of a route method has req and res as parameters, 
    // so we don't have to explicitly pass any arguments into addReply
    // this is a PUT route, instead of a POST, because technically we're not creating a new reply resource
    // instead, we're just updating the existing comment resource.
    .put(addReply)
    .delete(removeComment);

// model the routes in RESTful manner
// so a best practice we should include the ids of the parent resources in the endpoint
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;