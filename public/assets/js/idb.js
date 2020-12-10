// create variable to hold db connection
let db;
// create a request variable to act as an event listener for the database
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
// indexedDB is a part of the browser's window object therefore it is a global variable and we do not have to write window.indexedDb
// .open() method takes two parameters:  the name of the indexedDB database to create or connect to
// and the version of the database.  this parameter is used to determine whether the database's structure has changed between connections
const request = indexedDB.open('pizza_hunt', 1);

// once the connection to the database has been made, we can create the container that stores the data
// for indexedDB, the "object store" holds the data (tables hold data in sql)
// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
    // store a locally scoped connection to the database (save a reference to the database)
    const db = event.target.result;
    // then create the object store that will hold the pizza data
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// set this up so that when we finalize the connection to the database,
// we can store the resulting database object to the global variable db we created earlier
// this event will emit every time we interact with the database
// so every time it runs, we check to see if the app is connected to the internet
// if so, execute uploadPizza()
// upon a successful 
request.onsuccess = function (event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
        // we haven't created this yet, but we will soon, so let's comment it out for now
        uploadPizza();
    }
};

// inform us if anything ever goes rong with the database interaction
request.onerror = function (event) {
    // log error here
    console.log(event.target.errorCode);
};

// set up the functionality to writing data to the database
// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for `new_pizza`
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    pizzaObjectStore.add(record);
}

// uploads data upon internet connection by...
function uploadPizza() {
    // open a transaction on your db to read the data...
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // ...access your object store...
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // execute method to get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();

    // upon a successful .getAll() execution, run this function
    // getAll() will have a .result property that's an array of all the data we retrieved from the new_pizza object store
    getAll.onsuccess = function () {
        // if there was data in indexedDb's store, let's send it to the api server through a post
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // after a successful server interaction to post the data, open one more transaction
                    const transaction = db.transaction(['new_pizza'], 'readwrite');
                    // access the new_pizza object store
                    const pizzaObjectStore = transaction.objectStore('new_pizza');
                    // clear all items in your store
                    pizzaObjectStore.clear();

                    alert('All saved pizza has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}

// listen for app coming back online
// we instruct the app to listen for the browser regaining internet connection using the 'online' event
// if so, execute uploadPizza
window.addEventListener('online', uploadPizza);