const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");

describe("POST /search", () => {
    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        await mongoose.connection.dropDatabase();

        await request(app).post("/create-user").send({
            username: "StreamerOne",
            firstName: "First",
            lastName: "Streamer",
            email: "streamerone@example.com",
            password: "password123",
            confirmPassword: "password123",
            isStreamer: true
        });

        await request(app).post("/create-user").send({
            username: "StreamerTwo",
            firstName: "Second",
            lastName: "Streamer",
            email: "streamertwo@example.com",
            password: "password123",
            confirmPassword: "password123",
            isStreamer: true
        });
    });

    test("Successfully finds streamers by search query", async () => {
        const response = await request(app).post("/search").send({
            searchTerm: "Streamer"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.streamers.length).toBeGreaterThanOrEqual(2);
    });

    test("Returns no streamers found if search query does not match", async () => {
        const response = await request(app).post("/search").send({
            searchTerm: "NonExistentStreamer"
        });
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("No streamers found");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
