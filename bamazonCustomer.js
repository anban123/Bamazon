var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password = "root",
    database: "bamazondb"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as Id " + connection.threadId);

    console.table(results);
});

var itemList = [];

// Function to ask user what they'd like to buy and how much
function start() {
    inquirer.prompt([
    {
        name: "whichItem",
        type: "list",
        message: "Which item would you like to buy?",
        choices: itemList
    },
    {
        name: "howMany",
        type: "input",
        message: "How many would you like to buy?"
        validate: function(value) {
            if (value === integer) {
                return true;
            } else {
                return false;
            };
        };
    })
    .then(function(answer) {
        console.log(answer.whichItem);
    }); 
}
    //Inquirer prompt:
    //The first should ask them the ID of the product they would like to buy.
    //The second message should ask how many units of the product they would like to buy.

// Function to show items
function showItems() {

};

// Function to check store stock
function checkStock() {
    //Insufficient quantity! and prevent order
};

// Function to place customer order
function placeOrder() {
    //updating the SQL database to reflect the remaining quantity.
    //Once the update goes through, show the customer the total cost of their purchase.
};



