const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");

describe("POST /forgot-password", () => {
    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        await mongoose.connection.dropDatabase();
        await request(app).post("/create-user").send({
            username: "forgotpassworduser",
            firstName: "Test",
            lastName: "User",
            email: "testuser@example.com",
            password: "TestPassword123!",
            confirmPassword: "TestPassword123!"
        });
    });

    test("Should send a password reset email", async () => {
        const response = await request(app).post("/forgot-password").send({
            email: "testuser@example.com"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("If an account with that email exists, a password reset link has been sent");
    });
    test("Should respond with 404 and error message if user not found with given email", async () => {
        const response = await request(app).post("/forgot-password").send({
            email: "nonexistentEmail@example.com"
        });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual("User not found");
    })
    afterAll(async () => {
        await mongoose.connection.close();
    });
});
