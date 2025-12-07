import client from "../database.js";

export class OrderModel {
  async create({ userId, status = "active" }) {
    const conn = await client.connect();
    try {
      const sql =
        "INSERT INTO orders (user_id, status) VALUES ($1,$2) RETURNING id, user_id, status, created_at";
      const result = await conn.query(sql, [userId, status]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async addProduct({ orderId, productId, quantity }) {
    const conn = await client.connect();
    try {
      await conn.query("BEGIN");
      // get current product price
      const prodRes = await conn.query(
        "SELECT price FROM products WHERE id=$1",
        [productId]
      );
      if (!prodRes.rows[0]) throw new Error("Product not found");
      const unitPrice = prodRes.rows[0].price;

      // try update existing line
      const updateRes = await conn.query(
        "UPDATE order_products SET quantity = quantity + $1 WHERE order_id=$2 AND product_id=$3 RETURNING *",
        [quantity, orderId, productId]
      );

      if (updateRes.rowCount === 0) {
        const insertRes = await conn.query(
          "INSERT INTO order_products (order_id, product_id, quantity, unit_price) VALUES ($1,$2,$3,$4) RETURNING *",
          [orderId, productId, quantity, unitPrice]
        );
        await conn.query("COMMIT");
        return insertRes.rows[0];
      }

      await conn.query("COMMIT");
      return updateRes.rows[0];
    } catch (err) {
      await conn.query("ROLLBACK");
      throw err;
    } finally {
      conn.release();
    }
  }
  async getOrderById(orderId) {
    const conn = await client.connect();
    try {
      const orderRes = await conn.query(
        "SELECT id, user_id, status, created_at FROM orders WHERE id=$1",
        [orderId]
      );
      const order = orderRes.rows[0];
      if (!order) return null;
      const itemsRes = await conn.query(
        `SELECT op.product_id, p.name, op.quantity, op.unit_price, (op.quantity
* op.unit_price) as line_total
 FROM order_products op
 JOIN products p ON p.id = op.product_id
 WHERE op.order_id=$1`,
        [orderId]
      );
      order.items = itemsRes.rows;
      return order;
    } finally {
      conn.release();
    }
  }
  async getCurrentOrderByUser(userId) {
    const conn = await client.connect();
    try {
      const res = await conn.query(
        "SELECT id FROM orders WHERE user_id=$1 AND status=$2 LIMIT 1",
        [userId, "active"]
      );
      if (res.rowCount === 0) return null;
      return this.getOrderById(res.rows[0].id);
    } finally {
      conn.release();
    }
  }
  async completeOrder(orderId) {
    const conn = await client.connect();
    try {
      const res = await conn.query(
        "UPDATE orders SET status=$1 WHERE id=$2 RETURNING id, user_id, status",
        ["complete", orderId]
      );
      return res.rows[0];
    } finally {
      conn.release();
    }
  }
}
export default new OrderModel();
