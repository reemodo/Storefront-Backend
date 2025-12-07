import request from "supertest";
import app from "../src/server.js";
describe("User endpoints", () => {
  it("POST /api/users creates user and returns token", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ firstName: "Test", lastName: "User", password: "testpass" });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });
});
