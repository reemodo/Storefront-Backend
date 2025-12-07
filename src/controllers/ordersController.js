import OrderModel from "../models/orderModel.js";
export async function createOrder(req, res) {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });
  const order = await OrderModel.create({ userId });
  res.status(201).json(order);
}
export async function addProduct(req, res) {
  const orderId = parseInt(req.params.orderId, 10);
  const { productId, quantity } = req.body;
  if (!productId || !quantity)
    return res.status(400).json({ error: "Missing productId or quantity" });
  try {
    const line = await OrderModel.addProduct({ orderId, productId, quantity });
    res.status(201).json(line);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getCurrentOrder(req, res) {
  const userId = parseInt(req.query.userId, 10);
  if (!userId) return res.status(400).json({ error: "Missing userId query" });
  const order = await OrderModel.getCurrentOrderByUser(userId);
  if (!order) return res.status(404).json({ error: "No active order" });
  res.json(order);
}
export async function completeOrder(req, res) {
  const orderId = parseInt(req.params.orderId, 10);
  const updated = await OrderModel.completeOrder(orderId);
  res.json(updated);
}
