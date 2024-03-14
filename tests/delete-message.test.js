const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db"); 
const User = require("../models/create-user");
const Stream = require("../models/stream");
const Message = require("../models/send-message");

describe("DELETE /:userId/:messageId/delete", () => {
  let jwtToken, userId, streamId, messageId;

  beforeAll(async () => {
    await mongoose.connect(mongoURI);
    await mongoose.connection.dropDatabase();

    const userResponse = await request(app)
      .post("/create-user")
      .send({
        username: "userForDeletionTest",
        firstName: "First",
        lastName: "Last",
        email: "userdeletiontest@example.com",
        password: "password123",
        confirmPassword: "password123"
      });
    userId = userResponse.body.userId;

    const loginResponse = await request(app)
      .post("/login")
      .send({
        email: "userdeletiontest@example.com",
        password: "password123"
      });
    jwtToken = loginResponse.body.token;

    const streamResponse = await request(app)
      .post(`/${userId}/start-stream`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        streamTitle: "Test Stream",
        streamDescription: "This is a test stream."
      });
    streamId = streamResponse.body.streamId; 
    const messageResponse = await request(app)
      .post(`/${streamId}/send-message`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        content: "This is a test message."
      });
    messageId = messageResponse.body.data._id;
  });

  test("Should delete a message successfully", async () => {
    const response = await request(app)
      .delete(`/${userId}/${messageId}/delete`)
      .set("Authorization", `Bearer ${jwtToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Message deleted successfully");
  });
  test("Should respond with 401 if no jwt token provided", async () => {
    const response = await request(app)
      .delete(`/${userId}/${messageId}/delete`);

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Unauthorized access!");
  });
  test("Should respond with 404 if message not found", async () => {
    const response = await request(app)
      .delete(`/${userId}/nonexistentMessageId/delete`)
      .set("Authorization", `Bearer ${jwtToken}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Error deleting message");
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
