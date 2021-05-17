import { app } from "../app.js";
import request from "supertest";


describe("Checking health check endpoint", () => {
  test("When get request is sent a 200 should be returned", () => {
    return request(app)
      .get("/api/ping")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
});