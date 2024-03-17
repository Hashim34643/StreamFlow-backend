const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");

describe("POST /:userId/exit-stream/:streamId", () => {
    let jwtToken, userId, streamId;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        await mongoose.connection.dropDatabase();

        const userResponse = await request(app)
            .post("/create-user")
            .send({
                username: "streamUserExit",
                firstName: "StreamExit",
                lastName: "UserExit",
                email: "streamuserexit@example.com",
                password: "password1234",
                confirmPassword: "password1234"
            });
        userId = userResponse.body.userId;

        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "streamuserexit@example.com",
                password: "password1234"
            });
        jwtToken = loginResponse.body.token;

        const startStreamResponse = await request(app)
            .post(`/${userId}/start-stream`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                streamTitle: "Exit Test Stream",
                streamDescription: "This is a test stream for exit.",
                category: "Minecraft"
            });
        streamId = startStreamResponse.body.streamId;
    });

    test("User exits a stream successfully", async () => {
        const enter = await request(app)
            .post(`/${streamId}/enter/${userId}`)
            .set("Authorization", `Bearer ${jwtToken}`);
        const response = await request(app)
            .post(`/${streamId}/exit/${userId}`)
            .set("Authorization", `Bearer ${jwtToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Left stream successfully");
    });

    test("Unauthorized access without JWT token", async () => {
        const response = await request(app)
            .post(`/${streamId}/exit/${userId}`);
        
        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("Unauthorized access!");
    });

    test("Attempting to exit a non-existent stream", async () => {
        const fakeStreamId = "123456789012345678901234";
        const response = await request(app)
            .post(`/${fakeStreamId}/exit/${userId}`)
            .set("Authorization", `Bearer ${jwtToken}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("Stream not found");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
