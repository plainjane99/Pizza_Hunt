const { Schema, model, Types } = require('mongoose');

const dateFormat = require('../utils/dateFormat');

// we'll never query for just reply data so a model is not needed for replies
// use mongodb subdocument to create replies as an array for comments
// normalize the data by creating a schema
const ReplySchema = new Schema(
    {
        // unique identifier needed instead of _id field
        // set custom id to avoid confusion with parent comment _id
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String,
            required: true,
            trim: true
        },
        writtenBy: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

// define the comment schema with associated fields
const CommentSchema = new Schema(
    {
        writtenBy: {
            type: String,
            required: true
        },
        commentBody: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        // associate replies with comments
        // populate with an array of data that adheres to the ReplySchema definition
        // replies will be nested directly in a comment's document and not referred to
        replies: [ReplySchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

CommentSchema.virtual('replyCount').get(function () {
    return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;