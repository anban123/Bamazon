var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazondb"
});

connection.connect(function(err, results) {
    if (err) throw err;
    console.log("Connected as Id " + connection.threadId);

});

var itemArray = [];              
var action = process.argv[3];
Switch();

// Function to view products for sale  (read)
function viewProducts() {
    console.log("Viewing all items.\n");
    connection.query("SELECT * FROM items", function(err, res) {
        if (err) throw err;

        for (var i = 0; i < itemArray.length; i++) {
            something.push.res[i].product_name               //change something ------------------------
        }

        console.log(res);
        connection.end();
    })
};

// Function to view low inventory
function lowInventory() {
    console.log("Viewing items with low inventory, with 5 or less units.\n");
    connection.query("SELECT * FROM items WHERE stock_quantity <= 5", function(err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    })
};

// Function to add to inventory
function addInventory() {
    console.log("Adding more inventory.\n");

    connection.query("SELECT * FROM items", function(err, res) {
        if (err) throw err;

        for (var i = 0; i < itemArray.length; i++) {
            something.push.res[i].product_name          //change something ------------------
        }

    inquirer.prompt([
        {
            name: "productName",
            type: "list",
            message: "Which item will you be adding inventory to?",
            choices: itemArray
        },
        {
            name: "stockQuantity",
            type: "input",
            message: "How many units of inventory would you like to add?",
            validate: function(quantity) {
                if (quantity === NaN || quantity === decimal) {  //% quantity = 0?????????????
                    return false;
                    console.log("Please enter a valid number");
                } else {
                    return false;
                }
            }
        }
    ]);
    var query = connection.query(
        "UPDATE items SET ? WHERE ?",
        [
            {
                stock_quantity: answer.stockQuantity,  
            },
            {
                product_name: answer.productName,
            }
        ],
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " inventory added for " + answer);
            deleteItem();            //needed????????????
        }
    )
};

// Function to add a new product
function newProduct() {
    console.log("Creating a new product.\n");

    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "What product would you like to add?"
        },
        {
            name: "departmentName",
            type: "list",
            message: "Which department will this product be in?",
            choices: ["Personal Care", "Kitchen", "Office", "Sports", "Clothing"]
        },
        {
            name: "itemPrice",
            type: "input",
            message: "What is the product's price?",
            validate: function(price) {
                if (price === integer) {
                    return true;
                } else {
                    return false;
                    console.log("Please input a valid number.")
                };
            }
        },
        {
            name: "stockQuantity",
            type: "input",
            message: "How many units are there of this product?",
            validate: function(quantity) {
                if (quantity === NaN || quantity === decimal) {  //which one is correct? And do I need 2 validations?
                    return false;
                    console.log("Please input a valid number.");
                } else {
                    return true;
                };
            }
        }
    ]);                                                            //need .then!!!!!!!!!
    var query = connection.query(
        "INSERT INTO items SET ?",
        {
            product_name: answer.productName,
            department_name: answer.departmentName,
            price: answer.itemPrice,
            stock_quantity: answer.stockQuality
        }
    )
};

// Function to delete an item
function deleteItem() {
    console.log("Deleting item.\n");

    var itemArray = [];

    inquirer.prompt([
        {
            name: "productName",
            type: "list",
            message: "Which item would you like to delete?",
            choices: itemArray
        }
    ]);
    connection.query(
        "DELETE FROM items WHERE ?",
        {
            product_name: answer.productName
        },
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " item deleted!\n");
            viewProducts();     
        }
    )
};

function Switch(action) {
    switch (action) {
        case "view products for sale":
            return viewProducts();
        case "view low inventory":
            return lowInventory();
        case "add to inventory":
            return addInventory();
        case "add new product":
            return newProduct();
        default:
            return console.log("You're doing it wrong!!!")
    }
};
