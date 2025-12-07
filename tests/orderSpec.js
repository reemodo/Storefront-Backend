import request from "supertest";
import app from "../src/server.js";
describe("Orders endpoints", () => {
  it("Protected endpoints require token", async () => {
    const res = await request(app).get("/api/orders/current?userId=1");
    expect(res.statusCode).toBe(401);
  });
});
