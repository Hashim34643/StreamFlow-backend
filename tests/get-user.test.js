const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");
const User = require("../models/create-user");

describe("GET /user/:userId", () => {
    let user;

    beforeAll(async () => {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await mongoose.connection.dropDatabase();

        user = await User.create({
            username: "testuser",
            firstName: "Test",
            lastName: "User",
            email: "testuser@example.com",
            password: "password123",
            bio: "This is a test bio.",
            isStreamer: false,
        });
    });

    test("Should respond with the user's information for a valid userId", async () => {
        const response = await request(app).get(`/user/${user._id}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("User found");
        expect(response.body.user._id.toString()).toBe(user._id.toString());
        expect(response.body.user.firstName).toBe(user.firstName);
    });
    test("Should respond with 404 for a non-existent userId", async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId().toString();
        const response = await request(app).get(`/user/${nonExistentUserId}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("User not found");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
