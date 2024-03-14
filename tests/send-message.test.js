const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");
const User = require("../models/create-user");
const Stream = require("../models/stream");

describe("POST /streams/:streamId/send-message", () => {
  let jwtToken, userId, streamId;

  beforeAll(async () => {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.dropDatabase();

    const userResponse = await request(app)
      .post("/create-user")
      .send({
        username: "streamerUser",
        firstName: "Streamer",
        lastName: "User",
        email: "streamer@example.com",
        password: "password123",
        confirmPassword: "password123"
      });
    userId = userResponse.body.userId;

    const loginResponse = await request(app)
      .post("/login")
      .send({
        email: "streamer@example.com",
        password: "password123"
      });
    jwtToken = loginResponse.body.token;

    const streamResponse = await request(app)
      .post(`/${userId}/start-stream`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        streamTitle: "My First Stream",
        streamDescription: "Join my first live stream!"
      });

    streamId = streamResponse.body.streamId;
  });

  test("Should send a message successfully", async () => {
    const response = await request(app)
      .post(`/${streamId}/send-message`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        content: "Hello, world!"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Message sent successfully");
    expect(response.body.data).toHaveProperty("content", "Hello, world!");
  });

  test("Should not send a message to a non-existent stream", async () => {
    const nonExistentStreamId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`/${nonExistentStreamId}/send-message`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        content: "This message should not go through."
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Stream not found");
  });

  test("Should not send a message without content", async () => {
    const response = await request(app)
      .post(`/${streamId}/send-message`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({});
    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Failed to send message");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
