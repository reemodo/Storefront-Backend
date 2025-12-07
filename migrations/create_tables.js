

exports.up = function(db) {
return db.runSql(`
CREATE TABLE users (
id SERIAL PRIMARY KEY,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
password_digest VARCHAR(255) NOT NULL,
is_admin BOOLEAN DEFAULT false,
created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE products (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
price NUMERIC(10,2) NOT NULL,
category VARCHAR(100),
created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE orders (
id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
status VARCHAR(20) NOT NULL CHECK (status IN ('active','complete')),
created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE order_products (
id SERIAL PRIMARY KEY,
order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
quantity INTEGER NOT NULL CHECK (quantity > 0),
unit_price NUMERIC(10,2) NOT NULL,
created_at TIMESTAMP DEFAULT now(),
UNIQUE(order_id, product_id)
);
`);
};


exports.down = function(db) {
return db.runSql(`
DROP TABLE IF EXISTS order_products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
`);
};


exports._meta = { "version": 1 };