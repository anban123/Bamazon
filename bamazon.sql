DROP DATABASE IF EXISTS bamazondb;

CREATE DATABASE bamazondb;

USE bamazondb;

CREATE TABLE items (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price INTEGER(10,2) NOT NULL,
    stock_quantity INTEGER() NULL,
    PRIMARY KEY (id)
);

INSERT INTO items (product_name, department_name, price, stock_quantity)
VALUES ("Vanilla Soap", "Personal Care", 7.99, 24),
("Act", "Personal Care", 8.79, 45),
("Blender", "Kitchen", 129.59, 14),
("Black Pens", "Office", 2.00, 59),
("Water Bottle", "Sports", 34.98, 23),
("Stapler", "Office", 12.99, 37),
("Dress", "Clothing", 39.98, 12),
("Hand Cream", "Personal Care", 10.99, 56),
("Frying Pan", "Kitchen", 98.99, 26),
("Yoga Mat", "Sports", 24.98, 16);

SELECT * FROM items;