const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");

describe("POST /:userId/enter-stream/:streamId", () => {
    let jwtToken, userId, streamId;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        await mongoose.connection.dropDatabase();

        const userResponse = await request(app)
            .post("/create-user")
            .send({
                username: "streamUser",
                firstName: "Stream",
                lastName: "User",
                email: "streamuser@example.com",
                password: "password123",
                confirmPassword: "password123"
            });
        userId = userResponse.body.userId;

        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "streamuser@example.com",
                password: "password123"
            });
        jwtToken = loginResponse.body.token;

        const startStreamResponse = await request(app)
            .post(`/${userId}/start-stream`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                streamTitle: "Test Stream",
                streamDescription: "This is a test stream.",
                category: "Fortnite"
            });
        streamId = startStreamResponse.body.streamId;
    });

    test("User enters a stream successfully", async () => {
        const response = await request(app)
            .post(`/${streamId}/enter/${userId}`)
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Entered stream successfully");
    });
    test("Unauthorized access without JWT token", async () => {
        const response = await request(app)
            .post(`/${streamId}/enter/${userId}`);
        
        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("Unauthorized access!");
    });
    test("Attempting to enter a non-existent stream", async () => {
        const fakeStreamId = "123456789012345678901234";
        const response = await request(app)
            .post(`/${fakeStreamId}/enter/${userId}`)
            .set("Authorization", `Bearer ${jwtToken}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("Stream not found");
    });
    test("Attempting to enter with a non-existent user ID", async () => {
        const fakeUserId = "123456789012345678901234";
        const response = await request(app)
            .post(`/${streamId}/enter/${fakeUserId}`)
            .set("Authorization", `Bearer ${jwtToken}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("You cannot perform that action from this account");
    });
    test("Entering a stream with an invalid stream ID format", async () => {
        const invalidStreamId = "invalid123";
        const response = await request(app)
            .post(`/${invalidStreamId}/enter/${userId}`)
            .set("Authorization", `Bearer ${jwtToken}`);
        
        expect(response.statusCode).toBe(500); 
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("Error entering stream");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
