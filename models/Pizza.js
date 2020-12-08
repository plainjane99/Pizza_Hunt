// we only need the schema constructor and model function from mongoose
const { Schema, model } = require('mongoose');

// schema definition
// for clarity and usability, we define the fields to regulate what the data will look like
// this, however, is not required for mongodb
const PizzaSchema = new Schema({
    // we instruct the schema that this data will adhere to the built-in JavaScript data types
    // no special imported data types are required 
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: []
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;