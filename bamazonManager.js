var mysql = require("mysql");

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

var action = process.argv[3];
Switch();

// Function to view products for sale
function viewProducts() {

};

// Function to view low inventory
function lowInventory() {

};

// Function to add to inventory
function addInventory() {
    console.log("Adding more inventory.\n");
    var query = connection.query(
        "UPDATE items SET ? WHERE ?",
        [
            {
                stock_quantity: answer,  
            },
            {
                product_name: answer,
            }
        ],
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " inventory added for " + answer);
            //deleteItem();            //needed????????????
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
                if (quantity === integer) {  //which one is correct? And do I need 2 validations?
                    return true;
                } else {
                    return false;
                    console.log("Please input a valid number.")
                };
            },
            validate: function(quantity) {
                if (quantity === NaN) {      //???
                    return false;
                } else {
                    return true;
                };
            }
        }
    ]);
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
}
