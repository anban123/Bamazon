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

// Function to ask user what they'd like to buy and how much
function start() {
    // Query the database for all items being sold
    connection.query("SELECT * FROM auctions", function(err, results) {
        if (err) throw err;
    // Ask the user what they'd like to buy and how many
    inquirer.prompt([
    {
        name: "whichItem",
        type: "rawlist",
        message: "Which item would you like to buy?",
        choices: showItems()
    },
    {
        name: "howMany",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(value) {
            if (value === integer) {
                return true;
            } else {
                return false;
            };
        }
    }])
    .then(function(answer) {
        console.log(answer.whichItem);
    }); 
})
};

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



