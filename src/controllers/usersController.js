import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "secret";
export async function index(req, res) {
  const users = await UserModel.index();
  res.json(users);
}
export async function show(req, res) {
  const id = parseInt(req.params.id, 10);
  const user = await UserModel.show(id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}
export async function create(req, res) {
  const { firstName, lastName, password } = req.body;
  if (!firstName || !lastName || !password)
    return res.status(400).json({
      error: "Missing fields",
    });
  const user = await UserModel.create({ firstName, lastName, password });
  const token = jwt.sign(
    { userId: user.id, firstName: user.first_name },
    secret
  );
  res.status(201).json({ user, token });
}
export async function login(req, res) {
  const { firstName, lastName, password } = req.body;
  if (!firstName || !lastName || !password)
    return res.status(400).json({
      error: "Missing fields",
    });
  const user = await UserModel.authenticate({ firstName, lastName, password });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { userId: user.id, firstName: user.firstName, isAdmin: user.isAdmin },
    secret
  );
  res.json({ user, token });
}
