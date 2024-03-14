const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db")
const User = require("../models/create-user");

describe("DELETE /:userId/delete", () => {
    let jwtToken, userId;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        await mongoose.connection.dropDatabase();

        const newUser = {
            username: "deleteTestUser",
            firstName: "FirstName",
            lastName: "LastName",
            email: "deleteuser@example.com",
            password: "password123",
            confirmPassword: "password123"
        };
        await request(app).post("/create-user").send(newUser);

        const loginResponse = await request(app)
            .post("/login")
            .send({ email: "deleteuser@example.com", password: "password123" });
        jwtToken = loginResponse.body.token;
        userId = loginResponse.body.user._id;
    });

    test("Should respond with 200 and successfully delete the account", async () => {
        const response = await request(app)
            .delete(`/${userId}/delete`)
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Account deleted successfully");

        const user = await User.findById(userId);
        expect(user).toBeNull();
    });

    test("Should respond with 401 if unauthorized", async () => {
        const response = await request(app)
            .delete(`/${userId}/delete`);

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Unauthorized access!");
    });

    test("Should respond with 403 if trying to delete another user's account", async () => {
        const otherUserId = "someOtherUserId";
        const response = await request(app)
            .delete(`/${otherUserId}/delete`)
            .set("Authorization", `Bearer ${jwtToken}`); 

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Unauthorized access!");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
