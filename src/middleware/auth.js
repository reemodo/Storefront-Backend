import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || process.env.JWT_SECRET || "secret";
export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header)
      return res.status(401).json({ error: "Missing Authorization header" });
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
