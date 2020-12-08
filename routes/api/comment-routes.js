const router = require('express').Router();
const { addComment, removeComment } = require('../../controllers/comment-controllers');
const { route } = require('./pizza-routes');

router
    .route('/:pizzaId')
    .post(addComment);

router
    .route('/:pizzaId/:commentId')
    .delete(removeComment);

module.exports = router;