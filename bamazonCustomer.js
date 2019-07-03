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
    console.log("Connected as Id " + connection.threadId +"\n\n\n\n\n\n");
});


start();
//console.log("Here are all the available items.\n");

function start() {
    display();
};

// Function to display all items with 1 or more units in stock
function display() {
    connection.query("SELECT * FROM items GROUP BY stock_quantity HAVING count(*) > 0", function(err, data) {
        if (err) throw err;
        console.table(data);
        question();
})};

// Function to ask the user if they'd like to purchas an item or exit the app
function question() {
    inquirer
        .prompt({
        name: "startChoices",
        type: "list",
        message: "Would you like to purchase an item or exit the app?",
        choices: ["Purchase", "Exit"]
        })
        .then(function(answer) {
        // based on their answer, either call the purchase function or exit the app
        if (answer.startChoices === "Purchase") {
            placeOrder();
        }
        else if(answer.postOrBid === "Exit") {
            connection.end();
        }
    });
};

// Function to update the stock quantity of item purchased 
function updateProduct(amt, product, total) {
    console.log("Updating the database.\n");

    //console.log("amt", amt);           //works
    //console.log("product", product);   //works

    connection.query(`SELECT stock_quantity FROM items WHERE product_name = "${product}"`, function(err, res) {
        if (err) throw err;

        //console.log("stock_quantity", res[0].stock_quantity);     //works
        var newQuantity = res[0].stock_quantity - amt;
        //console.log("new amount", newQuantity);                   //works
    
        var query = connection.query(
        "UPDATE items SET ? WHERE ?",
        [
            {
            stock_quantity: newQuantity
            },
            {
            product_name: product
            } 
        ],
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            // Call deleteProduct AFTER the UPDATE completes
            //deleteProduct();
            console.log(`Your purchase of ${amt} units of ${product} for $${total} has been completed. Enjoy your ${product}! Please come back again soon!\n\n\n------------------------------------------------------------------------------------\n\n`);
            inquirer.prompt({                  //change units to unit if only 1???????????????????????
                name: "startOrend",
                type: "list",
                message: "Would you like to purchase another item or leave this app?",
                choices: ["Purchase another item.", "Leave the app."]
            }).then(function(answer) {
                if (answer.startOrend === "Purchase another item.") {
                    start();
                } else {
                    connection.end();
                }
            })
        });
    });
    // logs the actual query being run                    //needed??????????????????????????
   //console.log(query.sql);
};

var itemArray = [];

// Function to place customer order
function placeOrder() {
    connection.query("SELECT product_name FROM items GROUP BY stock_quantity HAVING count(*) > 0", function(err, res) {
        if (err) throw err;
    
        for (var i = 0; i < res.length; i++) {
            itemArray.push(res[i].product_name);
        };                          

    //console.table(itemArray)
    //var order = "";

    inquirer.prompt([
        {
            name: "order",
            type: "list",
            message: "Which item would you like to purchase?",
            choices: itemArray
        },
    ]).then(function(inq) {
        order = inq.order;
        console.log(`You picked ${inq.order}`);

        inquirer.prompt({
            name: "amount",
            type: "input",
            message: `How many ${inq.order} would you like to buy?`
        }).then(function(answer) {
            
            
            //console.log("order", inq.order)

            connection.query(`SELECT price FROM items WHERE product_name = "${inq.order}"`, function(err, res) {
            
            var totalPrice = (answer.amount * res[0].price).toFixed(2);
            var chosenItem = answer.amount;

            //console.log("amount", answer.amount);
            //console.log("res", res[0].price)

            inquirer.prompt({
                name: "yOrn",
                type: "confirm",
                message: `Do you want to buy ${chosenItem} for $${totalPrice}?`
            }).then(function(query) {
                //console.log("IT WORKED!!!")                                          //works
                console.log(`You purchased ${chosenItem} units of ${inq.order}`);    //works
                updateProduct(chosenItem, inq.order, totalPrice);
            });
        })
    });          
    });            
})};