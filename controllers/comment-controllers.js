const { Comment, Pizza } = require('../models');

// methods to add and delete comments
// assume no need to edit comments since we can just delete and add new
const commentController = {
    // add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        // create the comment object...
        Comment.create(body)
            // ...then pull out the new id from the comment object...
            .then(({ _id }) => {
                // ...and add it to our associate pizza object...
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    // just like regular javascript, 'push' adds data to an array
                    // $ indicates it is a mondodb-based function
                    { $push: { comments: _id } },
                    // new: true returns the updated pizza object with comment rather than just the original
                    { new: true }
                );
            })
            // ...return the pizza promise so we can do something with it...
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // replies exist directly within a comment
    // with new replies, we are updating an existing comment 
    // pass params 
    addReply({ params, body }, res) {
        // find comment and update it
        Comment.findOneAndUpdate(
            // where statement
            { _id: params.commentId },
            // add the data to the array
            { $push: { replies: body } },
            // return the updated comment
            { new: true, runValidators: true }
        )
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // remove reply
    // needs to delete the reply and update the comment
    // destructure 'params' for use
    removeReply({ params }, res) {
        // finds the comment document and updates it
        Comment.findOneAndUpdate(
            // where statement
            { _id: params.commentId },
            // remove the specific reply from the replies array
            // where the replyId matches the value of params.replyId passed in from the route
            { $pull: { replies: { replyId: params.replyId } } },
            // returns the updated comment object
            { new: true }
        )
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.json(err));
    },

    // remove comment
    // needs to delete the comment from the database but also from the pizza object
    // destructure 'params' for use
    removeComment({ params }, res) {
        // finds the comment document while also returns the data
        Comment.findOneAndDelete({ _id: params.commentId })
            // deletes the comment by id...
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment with this id!' });
                }
                // ...then takes the returned data and removes it from the pizza object
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    // uses the mongodb 'pull' function to remove the data
                    { $pull: { comments: params.commentId } },
                    // return the updated pizza object that does not have the deleted comment
                    { new: true }
                );
            })
            // return our pizza data
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    }
};

module.exports = commentController;