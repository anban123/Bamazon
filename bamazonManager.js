var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazondb"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as Id " + connection.threadId);
});

var itemArray = [];              
start();

// Function to ask user what they want to do
function start() {
    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "What would you like to do?",
        choices: ["View products for sale.", "View low inventory.", "Add to inventory.", "Add new product.", "Delete a product.", "Delete units of a product."]
    }) .then(function(answer) {
        console.log("answer: ", answer.choices);

        // Switch function to run chosen functions
        switch (answer.choices) {
            case "View products for sale.":
                return viewProducts();
            case "View low inventory.":
                return lowInventory();
            case "Add to inventory.":
                return addInventory();
            case "Add new product.":
                return newProduct();
            case "Delete a product.":
                return deleteItem();
            case "Delete units of a product.":
                return deleteUnits();
            default:
                return console.log("You're doing it wrong!!!")
        };
})};

// Function to view products for sale  (read)
function viewProducts() {
    console.log("Viewing all items.\n");
    connection.query("SELECT * FROM items", function(err, res) {
        if (err) throw err;

        console.table(res);
        connection.end();
})};

// Function to view low inventory
function lowInventory() {
    console.log("Viewing items with low inventory, with 5 or less units.\n");
    connection.query("SELECT * FROM items WHERE stock_quantity <= 5", function(err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
})};

// Function to add to inventory
function addInventory() {
    console.log("Adding more inventory.\n");
    connection.query("SELECT * FROM items", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            itemArray.push(res[i].product_name);
        };
    inquirer.prompt([
        {
            name: "productName",
            type: "list",
            message: "Which item will you be adding inventory to?",
            choices: itemArray
        },
        {
            name: "addedQuantity",
            type: "input",
            message: "How many units of inventory would you like to add?",
            validate: function(quantity) {
                if (quantity % 1 != 0) { 
                    console.log("\nPlease enter a valid number");
                    return false;
                } else {
                    return true;
    }}}]) .then(function(answer, res) {
            console.log("addedQuantity: ", answer.addedQuantity);

            connection.query(`SELECT stock_quantity FROM items WHERE product_name = "${answer.productName}"`, function(err, res) {
                if (err) throw err;
                var newQuantity = parseInt(answer.addedQuantity) + res[0].stock_quantity;

                connection.query( 
                "UPDATE items SET ? WHERE ?",
                [
                    {
                        stock_quantity: newQuantity,  
                    },
                    {
                        product_name: answer.productName,
                    }
                ],
                function(err, res) {
                    if (err) throw err;
                    //console.log(res.affectedRows)
                    console.log(answer.addedQuantity + " units added for " + answer.productName);
                })
                })
    })
})
};

// Function to add a new product
function newProduct() {
    // console.log("Creating a new product.\n");
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
                if (price != NaN) {                              //need to add validation for 2 decimals...
                    return true;
                } else {
                    console.log("Please input a valid number.")
                    return false;
                };
            }
        },
        {
            name: "stockQuantity",
            type: "input",
            message: "How many units are there of this product?",
            validate: function(quantity) {
                if (quantity % 1 != 0 || quantity === 0) {  
                    console.log("Please input a valid number.");
                    return false;
                } else {
                    return true;
                };
            }
        }
    ]).then(function(answer) {                                                        
        connection.query(
        "INSERT INTO items SET ?",
        {
            product_name: answer.productName,
            department_name: answer.departmentName,
            price: answer.itemPrice,
            stock_quantity: answer.stockQuantity
        }
    )
    viewProducts();
})
};

// Function to delete an item
function deleteItem() {
    // console.log("Deleting item.\n");
    connection.query("SELECT * FROM items", function(err, res) {
        if (err) throw err;
        var itemArray = [];
        for (var i = 0; i < res.length; i++) {
            itemArray.push(res[i].product_name);
        };
        inquirer.prompt([
            {
                name: "productName",
                type: "list",
                message: "Which item would you like to delete?",
                choices: itemArray
            }
        ]).then(function(answer) {
    
            connection.query(
                "DELETE FROM items WHERE ?",
                {
                    product_name: answer.productName
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " item deleted!\n");     
            })  
    })
})};

// Funtion to delete a select amount of units of an item (or all)
function deleteUnits() {
    connection.query("SELECT * FROM items", function(err, res) {
        if (err) throw err;
        var itemArray = [];
        for (var i = 0; i < res.length; i++) {
            itemArray.push(res[i].product_name);
        };
        inquirer.prompt([
            {
                name: "productName",
                type: "list",
                message: "Which item would you like to delete?",
                choices: itemArray
            },
            {
                name: "deleteAllQ",
                type: "list",
                message: "Would you like to delete all units of this product?",
                choices: ["Yes", "No"]
            }
        ]).then(function(answerA) {
            if (answerA.deleteAllQ === "Yes") {
                connection.query(
                    "DELETE FROM items WHERE ?",
                    {
                        product_name: answerA.productName
                    },
                    function(err, res) {
                        if (err) throw err;
                        console.log(`\nAll units of ${answerA.productName} have been deleted!\n`);
                        connection.end(); 
                })
            } else {
                inquirer.prompt({
                    name: "deleteNumber",
                    type: "input",
                    message: "How many units would you like to delete?",
                    validate: function(quantity) {
                        if (quantity = NaN || quantity < 1) {
                            console.log("Please input a valid number.");
                            return false;
                        } else {
                            return true;
                        }
                    }
                }).then(function(answerB) {

                    connection.query(`SELECT stock_quantity FROM items WHERE product_name = "${answerA.productName}"`, function(err, res) {
                        if (err) throw err;
                        var newAmount = res[0].stock_quantity - answerB.deleteNumber;
                        
                        connection.query(`UPDATE items SET ? WHERE ?`,
                            [
                                {
                                    stock_quantity: newAmount,  
                                },
                                {
                                    product_name: answerA.productName,
                                }
                            ],
                            function(err, res) {
                                if (err) throw err;
                                //console.log(res.affectedRows)
                                console.log(`\n\n${answerB.deleteNumber} has been deleted from ${answerA.productName}'s stock.\n\n`);
                            })
                        })
                    })
            }
    })
})};