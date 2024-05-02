const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const connectDB = require("../database");

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
});

// Test GET /api/getPoiStatus route
test("GET /api/getPoiStatus should fetch POIs", async () => {
  const response = await request(app).get("/api/getPoiStatus");
  expect(response.statusCode).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
}, 10000); // Timeout

// Test POST /api/createPoi route
describe("POI API", () => {
  describe("POST /api/createPoi", () => {
    const postData = {
      fromDate: "2024-04-01T00:43",
      toDate: "2024-05-02T00:43",
      description: "Test case abc123456",
      caseNumber: "098765432",
      severity: "high",
    };

    it("should create POI and return 201 with the resp data", async () => {
      const response = await request(app)
        .post("/api/createPoi")
        .send(postData)
        .expect(201);

      expect(response.body).toHaveProperty(
        "message",
        "POI created successfully"
      );
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toEqual(
        expect.objectContaining({
          description: postData.description,
          caseNumber: postData.caseNumber,
          severity: postData.severity,
        })
      );
    });

    it("should handle validation errors when required fields are missing", async () => {
      const response = await request(app)
        .post("/api/createPoi")
        .send({ description: "incomplete data" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });
});
