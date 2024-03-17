const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");
const User = require("../models/create-user");
const Stream = require("../models/stream");

describe("Stream Endpoints", () => {
    let jwtToken, userId, streamId;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        await mongoose.connection.dropDatabase();

        const userResponse = await request(app)
            .post("/create-user")
            .send({
                username: "streamer",
                firstName: "Test",
                lastName: "Streamer",
                email: "streamer@example.com",
                password: "password123",
                confirmPassword: "password123"
            });

        userId = userResponse.body.userId;
        
        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "streamer@example.com",
                password: "password123",
            });

        jwtToken = loginResponse.body.token;
    });

    test("Should start a stream successfully", async () => {
        const startStreamResponse = await request(app)
            .post(`/${userId}/start-stream`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                streamTitle: "My Awesome Stream",
                streamDescription: "This is going to be a great stream!",
                category: "Fortnite"
            });

        expect(startStreamResponse.statusCode).toBe(200);
        expect(startStreamResponse.body.success).toBe(true);
        expect(startStreamResponse.body.message).toBe("Stream started successfully");
        streamId = startStreamResponse.body.streamId
    });

    test("Should retrieve a specific stream by ID successfully", async () => {
        const response = await request(app).get(`/stream/${streamId}`);
        console.log(streamId);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.stream.streamTitle).toBe("My Awesome Stream");
    });

    test("Should end a stream successfully", async () => {
        const endStreamResponse = await request(app)
            .post(`/${userId}/end-stream`)
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(endStreamResponse.statusCode).toBe(200);
        expect(endStreamResponse.body.success).toBe(true);
        expect(endStreamResponse.body.message).toBe("Stream ended successfully");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
