import client from '../database.js';

export class ProductModel {
  async index() {
    const conn = await client.connect();
    try {
      const sql = 'SELECT id, name, price, category FROM products ORDER BY id';
      const result = await conn.query(sql);
      return result.rows;
    } finally {
      conn.release();
    }
  }

  async show(id) {
    const conn = await client.connect();
    try {
      const sql = 'SELECT id, name, price, category FROM products WHERE id=$1';
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }


  async create({ name, price, category = null }) {
    const conn = await client.connect();
    try {
      const sql = `INSERT INTO products (name, price, category) VALUES ($1,$2,$3) RETURNING id, name, price, category`;
      const result = await conn.query(sql, [name, price, category]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }


  async topFive() {
    const conn = await client.connect();
    try {
      const sql = `SELECT p.id, p.name, p.price, COALESCE(SUM(op.quantity),0) as total_sold
FROM products p
LEFT JOIN order_products op ON op.product_id = p.id
GROUP BY p.id
ORDER BY total_sold DESC
LIMIT 5`;
      const result = await conn.query(sql);
      return result.rows;
    } finally {
      conn.release();
    }
  }


  async byCategory(category) {
    const conn = await client.connect();
    try {
      const sql = 'SELECT id, name, price, category FROM products WHERE category=$1';
      const result = await conn.query(sql, [category]);
      return result.rows;
    } finally {
      conn.release();
    }
  }
}


export default new ProductModel();