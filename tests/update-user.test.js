const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");
const User = require("../models/create-user");

describe("PATCH /update-user/:userId", () => {
    let userId; 

    beforeAll(async () => {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await mongoose.connection.dropDatabase();

        const testUser = await User.create({
            username: "TestUserUpdate",
            firstName: "OriginalFirstName",
            lastName: "OriginalLastName",
            email: "testupdate@example.com",
            password: "password",
            bio: "Original bio",
            isStreamer: false
        });

        userId = testUser._id;
    });

    test("Should respond with status 200 and update the user's information", async () => {
        const updateData = {
            firstName: "UpdatedFirstName",
            lastName: "UpdatedLastName",
            bio: "Updated bio",
            isStreamer: true,
        };

        const response = await request(app)
            .patch(`/update-user/${userId}`)
            .send(updateData);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("User updated successfully");
        expect(response.body.user.firstName).toBe(updateData.firstName);
        expect(response.body.user.lastName).toBe(updateData.lastName);
        expect(response.body.user.bio).toBe(updateData.bio);
        expect(response.body.user.isStreamer).toBe(updateData.isStreamer);
    });
    test("Should respond with 404 for non-existent user ID", async () => {
        const response = await request(app)
            .patch(`/update-user/5f8d04b5b5b5b5b5b5b5b5b5`)
            .send({ firstName: "NewFirstName" });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("User not found");
    });

    test("Should respond with 400 for empty update data", async () => {
        const response = await request(app)
            .patch(`/update-user/${userId}`)
            .send({}); 

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Request body can only contain editable information");
    });

    test("Should respond with 400 for invalid field update", async () => {
        const response = await request(app)
            .patch(`/update-user/${userId}`)
            .send({ username: "" });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Request body can only contain editable information");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
