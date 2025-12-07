import request from "supertest";
import app from "../src/server.js";
describe("Products endpoints", () => {
  it("GET /api/products returns 200", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });
});
