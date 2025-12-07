import client from "../database.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

export class UserModel {
  async index() {
    const conn = await client.connect();
    try {
      const sql =
        "SELECT id, first_name, last_name, is_admin, created_at FROM users ORDER BY id";
      const result = await conn.query(sql);
      return result.rows;
    } finally {
      conn.release();
    }
  }

  async show(id) {
    const conn = await client.connect();
    try {
      const sql =
        "SELECT id, first_name, last_name, is_admin, created_at FROM users WHERE id=$1";
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async create({ firstName, lastName, password, isAdmin = false }) {
    const conn = await client.connect();
    try {
      const pwdHash = await hashPassword(password);
      const sql = `INSERT INTO users (first_name, last_name, password_digest, is_admin) VALUES ($1,$2,$3,$4) RETURNING id, first_name, last_name, is_admin, created_at`;
      const result = await conn.query(sql, [
        firstName,
        lastName,
        pwdHash,
        isAdmin,
      ]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async authenticate({ firstName, lastName, password }) {
    const conn = await client.connect();
    try {
      const sql =
        "SELECT id, first_name, last_name, password_digest, is_admin FROM users WHERE first_name=$1 AND last_name=$2";
      const result = await conn.query(sql, [firstName, lastName]);
      const user = result.rows[0];
      if (!user) return null;
      const valid = await comparePassword(password, user.password_digest);
      if (!valid) return null;
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin,
      };
    } finally {
      conn.release();
    }
  }
}

export default new UserModel();
