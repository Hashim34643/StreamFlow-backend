const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");
const User = require("../models/create-user");

describe("POST /:userId/end-stream", () => {
    let jwtToken, userId;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        await mongoose.connection.dropDatabase();

        const userResponse = await request(app)
            .post("/create-user")
            .send({
                username: "streamerUserEnd",
                firstName: "StreamerEnd",
                lastName: "UserEnd",
                email: "streamerend@example.com",
                password: "passwordEnd",
                confirmPassword: "passwordEnd"
            });
        
        userId = userResponse.body.userId;

        const loginResponse = await request(app)
            .post("/login")
            .send({
                email: "streamerend@example.com",
                password: "passwordEnd",
            });
        
        jwtToken = loginResponse.body.token;

        await request(app)
            .post(`/${userId}/start-stream`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                streamTitle: "Test Stream to End",
                streamDescription: "This is a test stream to be ended.",
                category: "Fortnite"
            });
    });

    test("Should end a stream successfully", async () => {
        const response = await request(app)
            .post(`/${userId}/end-stream`)
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Stream ended successfully");
    });

    test("Should not end stream if not currently live", async () => {
        const response = await request(app)
            .post(`/${userId}/end-stream`)
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Stream is not currently live");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
