// we only need the schema constructor and model function from mongoose
const { Schema, model } = require('mongoose');

// import the getter function
const dateFormat = require('../utils/dateFormat');

// schema definition
// for clarity and usability, we define the fields to regulate what the data will look like
// this, however, is not required for mongodb
const PizzaSchema = new Schema(
    {
        // we instruct the schema that this data will adhere to the built-in JavaScript data types
        // no special imported data types are required 
        pizzaName: {
            type: String,
            required: true,
            trim: true
        },
        createdBy: {
            type: String, 
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // use a getter to transform data by default every time it's queried
            // to use a getter in mongoose, we add the 'get' key to the field we are looking to use it within the schema
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        size: {
            type: String,
            required: true,
            // enum stands for enumerable, which refers to a set of data that can be iterated over
            // it provides an array of options that are acceptable
            enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
            default: 'Large'
        },
        toppings: [],
        // add a comments array field to the schema to have the parent Pizza object keep track of the child Comment object
        // comments will also be accessed only when pizza is accessed.  
        // comments will not stand alone
        comments: [
            {
                // tell mongoose to expect an ObjectId and to tell it that data comes from the Comment model
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    },
    // tell the schema to use virtuals and getters
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        // set to false because this is a virtual
        id: false
    }
);

// use mongoose virtuals to add virtual properties to a document that aren't stored in the database
// the virtual data remains persistent without creating a function to do so
// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function () {
    // use reduce method to tally up the total of every comment with its replies
    // reduce takes two parameters, an accumulator and a current value
    // accumulator is total, current value is comment
    // as reduce walks through array, it passes the accumulating total and the current value of comment into the function
    // with the return of the function revising the total for the next iteration through the array
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;