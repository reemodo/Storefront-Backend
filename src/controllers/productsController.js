import ProductModel from "../models/productModel.js";
export async function index(req, res) {
  const products = await ProductModel.index();
  res.json(products);
}
export async function show(req, res) {
  const id = parseInt(req.params.id, 10);
  const product = await ProductModel.show(id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
}
export async function create(req, res) {
  const { name, price, category } = req.body;
  if (!name || price == null)
    return res.status(400).json({ error: "Missing name or price" });
  const product = await ProductModel.create({ name, price, category });
  res.status(201).json(product);
}
export async function topFive(req, res) {
  const list = await ProductModel.topFive();
  res.json(list);
}
export async function byCategory(req, res) {
  const { category } = req.query;
  if (!category)
    return res.status(400).json({ error: "Missing category query" });
  const list = await ProductModel.byCategory(category);
  res.json(list);
}
v;
