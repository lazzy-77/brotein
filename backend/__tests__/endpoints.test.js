import { app } from "../server.js";
import request from "supertest";

describe('Sample Test', () => {
    it('should test that true === true', () => {
      expect(true).toBe(true)
    })
  })

describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
});