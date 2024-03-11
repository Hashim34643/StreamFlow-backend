const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");
const User = require("../models/create-user");

describe("POST /:userId/unfollow/:streamerId", () => {
    let jwtToken1, jwtToken2, userId1, userId2;

  beforeAll(async () => {
    await mongoose.connect(mongoURI);
    await mongoose.connection.dropDatabase();

    const newUser = {
      username: "TestUser",
      firstName: "TestFirstName",
      lastName: "TestLastName",
      email: "TestEmail@gmail.com",
      password: "TestPassword",
      confirmPassword: "TestPassword"
    };
    await request(app).post("/create-user").send(newUser);

    const newUser2 = {
      username: "TestUser2",
      firstName: "TestFirstName2",
      lastName: "TestLastName2",
      email: "TestEmail2@gmail.com",
      password: "TestPassword",
      confirmPassword: "TestPassword"
    };
    await request(app).post("/create-user").send(newUser2);

    const response1 = await request(app).post("/login").send({
      email: "TestEmail@gmail.com",
      password: "TestPassword"
    });
    jwtToken1 = response1.body.token;
    userId1 = response1.body.user._id; 

    const response2 = await request(app).post("/login").send({
      email: "TestEmail2@gmail.com",
      password: "TestPassword"
    });
    jwtToken2 = response2.body.token;
    userId2 = response2.body.user._id;
    await request(app).post(`/${userId1}/follow/${userId2}`).set("authorization", `BEARER ${jwtToken1}`);
  });
  
  test("Should respond with 200, update users following list and update followed users followers list", async () => {
    const response = await request(app).post(`/${userId1}/unfollow/${userId2}`).set("authorization", `BEARER ${jwtToken1}`);
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Successfully unfollowed the user");
    expect(user1.following.length).toBe(0);
    expect(user2.followers.length).toBe(0);
  });
  test("Should respond with 401 and error message if no jwt token provided", async () => {
    const response = await request(app).post(`/${userId1}/unfollow/${userId2}`);
    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Unauthorized access!");
  });
  test("Should respond with 400 and error message if user tries to unfollow their own account", async () => {
    const response = await request(app).post(`/${userId1}/unfollow/${userId1}`).set("authorization", `BEARER ${jwtToken1}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("You are not following this user");
  });
  test("Should respond with 404 and error message if user tries to unfollow non existent user", async () => {
    const response = await request(app).post(`/${userId1}/unfollow/65ef39708f50eb78c9eabe51`).set("authorization", `BEARER ${jwtToken1}`)
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User or streamer not found");
  });
  test("Should respond with 400 and error message if user tries to unfollow a user they're not following", async () => {
    const response = await request(app).post(`/${userId1}/unfollow/${userId2}`).set("authorization", `BEARER ${jwtToken1}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("You are not following this user");
  });

  afterAll( async () => {
    await mongoose.connection.close();
  })
})