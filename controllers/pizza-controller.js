// functionality will reside in the controller files

const { Pizza } = require('../models');

// define pizzaController object
const pizzaController = {
    // the functions will go in here as methods
    // these methods will be used as the callback functions for the Express.js routes
    // each will take two parameters: req and res

    // this will be the callback function for the GET /api/pizzas route
    // get all pizzas
    getAllPizza(req, res) {
        // mongoose's 'find' method
        Pizza.find({})
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one pizza by id
    // destructure 'params' out of the express.js req object so that we don't have to access the entire req
    getPizzaById({ params }, res) {
        // mongoose's find a single dataset
        Pizza.findOne({ _id: params.id })
            .then(dbPizzaData => {
                // If no pizza is found, send 404
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // this will be the callback function for the POST /api/pizzas route
    // createPizza
    // destructure 'body' out of the express.js req object
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },

    // this will be the callback function for the PUT /api/pizzas route
    // update pizza by id
    updatePizza({ params, body }, res) {
        // third paramter of { new: true } returns an updated version of the document rather than the original
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },

    // this will be the callback function for the DELETE /api/pizzas route
    // delete pizza
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController;