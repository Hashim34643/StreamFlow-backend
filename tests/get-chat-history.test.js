const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");
const User = require("../models/create-user");
const Stream = require("../models/stream");

describe("GET /chat/history/:streamId", () => {
  let jwtToken, userId, streamId;

  beforeAll(async () => {
    await mongoose.connect(mongoURI);
    await mongoose.connection.dropDatabase();

    const userResponse = await request(app)
      .post("/create-user")
      .send({
        username: "streamer",
        firstName: "Stream",
        lastName: "Streamer",
        email: "streamer@example.com",
        password: "streamPassword",
        confirmPassword: "streamPassword",
      });
    userId = userResponse.body.userId;

    const loginResponse = await request(app)
      .post("/login")
      .send({
        email: "streamer@example.com",
        password: "streamPassword",
      });
    jwtToken = loginResponse.body.token;

    const startStreamResponse = await request(app)
      .post(`/${userId}/start-stream`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        streamTitle: "My Live Stream",
        streamDescription: "This is a test live stream",
      });
    streamId = startStreamResponse.body.streamId;

    await request(app)
      .post(`/${streamId}/send-message`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        streamId: streamId,
        content: "Hello, World!",
      });
  });

  test("Should retrieve chat history for a given streamId", async () => {
    const response = await request(app).get(`/chat/history/${streamId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.messages)).toBe(true);
    expect(response.body.messages.length).toBeGreaterThan(0);
    expect(response.body.messages[0].content).toBe("Hello, World!");
  });

  test("Should return 404 if the stream does not exist", async () => {
    const response = await request(app).get(`/chat/history/65f293dff7820eed55b79cc4`);
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Stream not found");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
