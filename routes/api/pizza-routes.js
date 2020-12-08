const router = require('express').Router();

// import all of the controller functions
// destructure the methods from the object so that we can use the methods by their direct names
// (instead of pizza-controller.getAllPizza() for example)
const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controller');

// Set up GET all and POST at /api/pizzas
router
    .route('/')
    // provide the name of the controller method as the callback of each route
    .get(getAllPizza)
    .post(createPizza);

// Set up GET one, PUT, and DELETE at /api/pizzas/:id
router
    .route('/:id')
    // provide the name of the controller method as the callback of each route
    .get(getPizzaById)
    .put(updatePizza)
    .delete(deletePizza);

module.exports = router;