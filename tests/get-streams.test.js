const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");
const User = require("../models/create-user");
const Stream = require("../models/stream");

describe("GET /streams", () => {
    let jwtToken, userId;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        await mongoose.connection.dropDatabase();

        const userResponse = await request(app)
            .post("/create-user")
            .send({
                username: "liveStreamer",
                firstName: "Live",
                lastName: "Streamer",
                email: "livestreamer@example.com",
                password: "password123",
                confirmPassword: "password123",
                isStreamer: true
            });
        userId = userResponse.body.userId;

        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "livestreamer@example.com",
                password: "password123",
            });
        jwtToken = loginResponse.body.token;
    });

    test("Should return an error message when no live streams are found", async () => {
        const response = await request(app)
            .get("/streams")
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("No live streams found");
    });
    test("Should retrieve all live streams", async () => {
        await request(app)
        .post(`/${userId}/start-stream`)
        .set("Authorization", `Bearer ${jwtToken}`)
        .send({
            streamTitle: "Test Stream 1",
            streamDescription: "This is a test stream 1",
            category: "Fortnite"
        });
        await request(app)
        .post(`/${userId}/start-stream`)
        .set("Authorization", `Bearer ${jwtToken}`)
        .send({
            streamTitle: "Test Stream 2",
            streamDescription: "This is a test stream 2",
            category: "Minecraft"
        });
        const response = await request(app).get("/streams");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.streams.length).toBeGreaterThanOrEqual(1);
        response.body.streams.forEach(stream => {
            expect(stream.liveStatus).toBe(true);
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
