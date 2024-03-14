const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");
const User = require("../models/create-user");

describe("POST /:userId/start-stream", () => {
    let jwtToken, userId;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        await mongoose.connection.dropDatabase();

        const userResponse = await request(app)
            .post("/create-user")
            .send({
                username: "streamerUser",
                firstName: "Streamer",
                lastName: "User",
                email: "streamer@example.com",
                password: "password",
                confirmPassword: "password"
            });
        
        userId = userResponse.body.userId;

        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "streamer@example.com",
                password: "password",
            });
        
        jwtToken = loginResponse.body.token;
    });

    test("Should start a stream successfully", async () => {
        const response = await request(app)
            .post(`/${userId}/start-stream`)
            .set("authorization", `Bearer ${jwtToken}`)
            .send({
                streamTitle: "My First Stream",
                streamDescription: "Join my first live stream!",
            });
            console.log(response.body)
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Stream started successfully");
    });

    test("Should not start stream if already live", async () => {
        const response = await request(app)
            .post(`/${userId}/start-stream`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                streamTitle: "Another Stream Attempt",
                streamDescription: "Trying to start another stream.",
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Stream is already live");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
